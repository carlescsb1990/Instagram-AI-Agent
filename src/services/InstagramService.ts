import { Page, Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { IInstagramAccount } from "../models/User";
import logger from "../config/logger";
import { runAgent } from "../Agent";
import { getInstagramCommentSchema } from "../Agent/schema";

puppeteer.use(StealthPlugin());

export class InstagramService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private account: IInstagramAccount;
  private isLoggedIn = false;

  constructor(account: IInstagramAccount) {
    this.account = account;
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: process.env.NODE_ENV === "production",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
          "--disable-notifications",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-renderer-backgrounding",
          "--disable-features=TranslateUI",
        ],
      });

      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1366, height: 768 });

      // Set user agent
      await this.page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      );

      logger.info(`Instagram service initialized for ${this.account.username}`);
    } catch (error) {
      logger.error("Error initializing Instagram service:", error);
      throw error;
    }
  }

  async login(): Promise<boolean> {
    if (!this.page) throw new Error("Page not initialized");

    try {
      // Load cookies if available
      if (this.account.cookies && this.account.cookies.length > 0) {
        await this.page.setCookie(...this.account.cookies);
        await this.page.goto("https://www.instagram.com/", {
          waitUntil: "networkidle2",
        });

        // Check if already logged in
        const isLoggedIn = await this.page.$("a[href='/direct/inbox/']");
        if (isLoggedIn) {
          this.isLoggedIn = true;
          logger.info(`Logged in using cookies: ${this.account.username}`);
          return true;
        }
      }

      // Fresh login
      await this.page.goto("https://www.instagram.com/accounts/login/", {
        waitUntil: "networkidle2",
      });

      // Wait for login form
      await this.page.waitForSelector('input[name="username"]', {
        timeout: 10000,
      });

      // Fill credentials
      await this.page.type('input[name="username"]', this.account.username, {
        delay: 100,
      });
      await this.page.type('input[name="password"]', this.account.password, {
        delay: 100,
      });

      // Click login
      await this.page.click('button[type="submit"]');
      await this.page.waitForNavigation({ waitUntil: "networkidle2" });

      // Handle potential security checks
      await this.handleSecurityChecks();

      // Save cookies
      const cookies = await this.browser!.cookies();
      this.account.cookies = cookies;

      this.isLoggedIn = true;
      logger.info(`Successfully logged in: ${this.account.username}`);
      return true;
    } catch (error) {
      logger.error(`Login failed for ${this.account.username}:`, error);
      return false;
    }
  }

  private async handleSecurityChecks(): Promise<void> {
    if (!this.page) return;

    try {
      // Handle "Save Your Login Info" popup
      const saveLoginButton = await this.page.$('button:contains("Not Now")');
      if (saveLoginButton) {
        await saveLoginButton.click();
        await this.page.waitForTimeout(2000);
      }

      // Handle "Turn on Notifications" popup
      const notificationButton = await this.page.$(
        'button:contains("Not Now")',
      );
      if (notificationButton) {
        await notificationButton.click();
        await this.page.waitForTimeout(2000);
      }

      // Handle suspicious login attempt
      const suspiciousLogin = await this.page.$('button:contains("It Was Me")');
      if (suspiciousLogin) {
        await suspiciousLogin.click();
        await this.page.waitForTimeout(3000);
      }
    } catch (error) {
      logger.warn("Error handling security checks:", error);
    }
  }

  async likePostsByHashtag(
    hashtag: string,
    maxLikes: number = 10,
  ): Promise<number> {
    if (!this.isLoggedIn) throw new Error("Not logged in");
    if (!this.page) throw new Error("Page not initialized");

    try {
      const url = `https://www.instagram.com/explore/tags/${hashtag}/`;
      await this.page.goto(url, { waitUntil: "networkidle2" });

      let likesCount = 0;
      const posts = await this.page.$$("article div div div div a");

      for (let i = 0; i < Math.min(posts.length, maxLikes); i++) {
        try {
          await posts[i].click();
          await this.page.waitForTimeout(2000);

          // Check if already liked
          const likeButton = await this.page.$('svg[aria-label="Like"]');
          if (likeButton) {
            await likeButton.click();
            likesCount++;
            logger.info(`Liked post ${i + 1} for hashtag #${hashtag}`);

            // Random delay to appear human
            await this.page.waitForTimeout(Math.random() * 5000 + 3000);
          }

          // Close post modal
          const closeButton = await this.page.$(
            'button svg[aria-label="Close"]',
          );
          if (closeButton) {
            await closeButton.click();
            await this.page.waitForTimeout(1000);
          }
        } catch (error) {
          logger.warn(`Error processing post ${i + 1}:`, error);
        }
      }

      logger.info(`Completed liking ${likesCount} posts for #${hashtag}`);
      return likesCount;
    } catch (error) {
      logger.error(`Error liking posts for hashtag #${hashtag}:`, error);
      return 0;
    }
  }

  async commentOnPosts(
    hashtag: string,
    maxComments: number = 5,
  ): Promise<number> {
    if (!this.isLoggedIn) throw new Error("Not logged in");
    if (!this.page) throw new Error("Page not initialized");

    try {
      const url = `https://www.instagram.com/explore/tags/${hashtag}/`;
      await this.page.goto(url, { waitUntil: "networkidle2" });

      let commentsCount = 0;
      const posts = await this.page.$$("article div div div div a");

      for (let i = 0; i < Math.min(posts.length, maxComments); i++) {
        try {
          await posts[i].click();
          await this.page.waitForTimeout(3000);

          // Generate AI comment
          const postContext = await this.getPostContext();
          const aiComment = await this.generateComment(postContext);

          // Find comment box
          const commentBox = await this.page.$(
            'textarea[placeholder*="comment"]',
          );
          if (commentBox && aiComment) {
            await commentBox.type(aiComment, { delay: 100 });
            await this.page.waitForTimeout(1000);

            // Submit comment
            const submitButton = await this.page.$('button[type="submit"]');
            if (submitButton) {
              await submitButton.click();
              commentsCount++;
              logger.info(
                `Posted comment ${i + 1} for hashtag #${hashtag}: ${aiComment}`,
              );

              // Random delay
              await this.page.waitForTimeout(Math.random() * 10000 + 5000);
            }
          }

          // Close post modal
          const closeButton = await this.page.$(
            'button svg[aria-label="Close"]',
          );
          if (closeButton) {
            await closeButton.click();
            await this.page.waitForTimeout(1000);
          }
        } catch (error) {
          logger.warn(`Error commenting on post ${i + 1}:`, error);
        }
      }

      logger.info(
        `Completed commenting on ${commentsCount} posts for #${hashtag}`,
      );
      return commentsCount;
    } catch (error) {
      logger.error(`Error commenting on posts for hashtag #${hashtag}:`, error);
      return 0;
    }
  }

  private async getPostContext(): Promise<string> {
    if (!this.page) return "";

    try {
      // Get post caption
      const caption = await this.page
        .$eval(
          'meta[property="og:description"]',
          (el) => el.getAttribute("content") || "",
        )
        .catch(() => "");

      // Get visible text from post
      const postText = await this.page
        .$eval("article", (el) => el.textContent?.slice(0, 200) || "")
        .catch(() => "");

      return caption || postText || "Instagram post";
    } catch (error) {
      return "Instagram post";
    }
  }

  private async generateComment(context: string): Promise<string> {
    try {
      const schema = getInstagramCommentSchema();
      const prompt = `Generate a natural, engaging comment for this Instagram post: "${context}". Make it authentic and relevant.`;

      const result = await runAgent(schema, prompt);
      return result?.comment || this.getRandomComment();
    } catch (error) {
      logger.warn("Error generating AI comment, using fallback:", error);
      return this.getRandomComment();
    }
  }

  private getRandomComment(): string {
    const comments = [
      "¡Increíble! 🔥",
      "Me encanta este contenido 💙",
      "¡Excelente trabajo! 👏",
      "Inspirador 🚀",
      "¡Qué genial! ✨",
      "Amazing content! 🙌",
      "Love this! ❤️",
      "So good! 🔥",
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  }

  async followUsersByHashtag(
    hashtag: string,
    maxFollows: number = 10,
  ): Promise<number> {
    if (!this.isLoggedIn) throw new Error("Not logged in");
    if (!this.page) throw new Error("Page not initialized");

    try {
      const url = `https://www.instagram.com/explore/tags/${hashtag}/`;
      await this.page.goto(url, { waitUntil: "networkidle2" });

      let followsCount = 0;
      const posts = await this.page.$$("article div div div div a");

      for (let i = 0; i < Math.min(posts.length, maxFollows); i++) {
        try {
          await posts[i].click();
          await this.page.waitForTimeout(2000);

          // Click on username to go to profile
          const usernameLink = await this.page.$("header a");
          if (usernameLink) {
            await usernameLink.click();
            await this.page.waitForTimeout(3000);

            // Check if follow button exists (not already following)
            const followButton = await this.page.$('button:contains("Follow")');
            if (followButton) {
              await followButton.click();
              followsCount++;
              logger.info(`Followed user ${i + 1} from hashtag #${hashtag}`);

              // Random delay
              await this.page.waitForTimeout(Math.random() * 10000 + 5000);
            }
          }

          // Go back to hashtag page
          await this.page.goBack();
          await this.page.waitForTimeout(2000);
        } catch (error) {
          logger.warn(`Error following user ${i + 1}:`, error);
        }
      }

      logger.info(`Completed following ${followsCount} users for #${hashtag}`);
      return followsCount;
    } catch (error) {
      logger.error(`Error following users for hashtag #${hashtag}:`, error);
      return 0;
    }
  }

  async sendDirectMessage(username: string, message: string): Promise<boolean> {
    if (!this.isLoggedIn) throw new Error("Not logged in");
    if (!this.page) throw new Error("Page not initialized");

    try {
      // Go to direct messages
      await this.page.goto("https://www.instagram.com/direct/inbox/", {
        waitUntil: "networkidle2",
      });

      // Click new message button
      const newMessageButton = await this.page.$(
        'button svg[aria-label="New message"]',
      );
      if (newMessageButton) {
        await newMessageButton.click();
        await this.page.waitForTimeout(2000);

        // Search for user
        const searchInput = await this.page.$('input[placeholder*="Search"]');
        if (searchInput) {
          await searchInput.type(username, { delay: 100 });
          await this.page.waitForTimeout(2000);

          // Select user from results
          const userResult = await this.page.$(`span:contains("${username}")`);
          if (userResult) {
            await userResult.click();
            await this.page.waitForTimeout(1000);

            // Click next/send button
            const nextButton =
              (await this.page.$('button:contains("Next")')) ||
              (await this.page.$('button:contains("Send")'));
            if (nextButton) {
              await nextButton.click();
              await this.page.waitForTimeout(2000);

              // Type message
              const messageInput = await this.page.$(
                'textarea[placeholder*="Message"]',
              );
              if (messageInput) {
                await messageInput.type(message, { delay: 100 });
                await this.page.waitForTimeout(1000);

                // Send message
                const sendButton = await this.page.$('button:contains("Send")');
                if (sendButton) {
                  await sendButton.click();
                  logger.info(`Sent DM to ${username}: ${message}`);
                  return true;
                }
              }
            }
          }
        }
      }

      return false;
    } catch (error) {
      logger.error(`Error sending DM to ${username}:`, error);
      return false;
    }
  }

  async getAccountStats(): Promise<any> {
    if (!this.isLoggedIn) throw new Error("Not logged in");
    if (!this.page) throw new Error("Page not initialized");

    try {
      // Go to own profile
      await this.page.goto(
        `https://www.instagram.com/${this.account.username}/`,
        { waitUntil: "networkidle2" },
      );

      // Extract stats
      const stats = await this.page.evaluate(() => {
        const statsElements = document.querySelectorAll(
          'meta[property="og:description"]',
        );
        const description = statsElements[0]?.getAttribute("content") || "";

        // Parse follower count, following count, posts count from meta description
        const followersMatch = description.match(/(\d+(?:,\d+)*)\s+Followers/);
        const followingMatch = description.match(/(\d+(?:,\d+)*)\s+Following/);
        const postsMatch = description.match(/(\d+(?:,\d+)*)\s+Posts/);

        return {
          followers: followersMatch
            ? parseInt(followersMatch[1].replace(/,/g, ""))
            : 0,
          following: followingMatch
            ? parseInt(followingMatch[1].replace(/,/g, ""))
            : 0,
          posts: postsMatch ? parseInt(postsMatch[1].replace(/,/g, "")) : 0,
        };
      });

      logger.info(`Retrieved stats for ${this.account.username}:`, stats);
      return stats;
    } catch (error) {
      logger.error(`Error getting stats for ${this.account.username}:`, error);
      return { followers: 0, following: 0, posts: 0 };
    }
  }

  async runAutomation(): Promise<void> {
    if (!this.account.isActive) return;

    try {
      const settings = this.account.settings;

      if (settings.autoLike && settings.targetHashtags.length > 0) {
        for (const hashtag of settings.targetHashtags) {
          await this.likePostsByHashtag(
            hashtag,
            settings.maxLikesPerHour / settings.targetHashtags.length,
          );
          await this.page?.waitForTimeout(5000); // Pause between hashtags
        }
      }

      if (settings.autoComment && settings.targetHashtags.length > 0) {
        for (const hashtag of settings.targetHashtags) {
          await this.commentOnPosts(
            hashtag,
            Math.floor(
              settings.maxCommentsPerHour / settings.targetHashtags.length,
            ),
          );
          await this.page?.waitForTimeout(10000);
        }
      }

      if (settings.autoFollow && settings.targetHashtags.length > 0) {
        for (const hashtag of settings.targetHashtags) {
          await this.followUsersByHashtag(
            hashtag,
            Math.floor(
              settings.maxFollowsPerHour / settings.targetHashtags.length,
            ),
          );
          await this.page?.waitForTimeout(15000);
        }
      }

      // Update account stats
      const stats = await this.getAccountStats();
      this.account.stats = { ...this.account.stats, ...stats };
      this.account.lastActivity = new Date();
    } catch (error) {
      logger.error(
        `Error running automation for ${this.account.username}:`,
        error,
      );
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      logger.info(`Cleaned up Instagram service for ${this.account.username}`);
    } catch (error) {
      logger.error("Error cleaning up Instagram service:", error);
    }
  }

  async runLikeAutomation(
    hashtag: string,
    maxLikes: number = 20,
  ): Promise<{ likes: number; comments: number; follows: number }> {
    if (!this.page || !this.isLoggedIn) {
      throw new Error("Not logged in or page not initialized");
    }

    try {
      const results = { likes: 0, comments: 0, follows: 0 };

      // Navigate to hashtag page
      const hashtagUrl = `https://www.instagram.com/explore/tags/${hashtag}/`;
      await this.page.goto(hashtagUrl, { waitUntil: "networkidle2" });

      logger.info(`Navigated to hashtag: ${hashtag}`);

      // Wait for posts to load
      await this.page.waitForSelector("article", { timeout: 10000 });

      // Get posts from the hashtag page
      const posts = await this.page.$$('article a[href*="/p/"]');
      const selectedPosts = posts.slice(0, Math.min(maxLikes, posts.length));

      logger.info(
        `Found ${posts.length} posts, will process ${selectedPosts.length}`,
      );

      for (let i = 0; i < selectedPosts.length; i++) {
        try {
          // Click on post
          await selectedPosts[i].click();
          await this.page.waitForSelector("article", { timeout: 5000 });

          // Like the post
          const likeButton = await this.page.$(
            'button[aria-label="Like"], svg[aria-label="Like"]',
          );
          if (likeButton) {
            await likeButton.click();
            results.likes++;
            logger.info(`Liked post ${i + 1}/${selectedPosts.length}`);
          }

          // Sometimes add a comment using AI
          if (Math.random() < 0.3 && this.account.settings?.autoComment) {
            // 30% chance
            try {
              const comment = await this.generateAIComment(hashtag);
              const commentInput = await this.page.$(
                'textarea[aria-label="Add a comment..."]',
              );
              if (commentInput && comment) {
                await commentInput.type(comment);
                await this.page.keyboard.press("Enter");
                results.comments++;
                logger.info(`Added AI comment: ${comment.substring(0, 50)}...`);
              }
            } catch (commentError) {
              logger.warn("Could not add comment:", commentError);
            }
          }

          // Close post modal
          const closeButton = await this.page.$('button[aria-label="Close"]');
          if (closeButton) {
            await closeButton.click();
          } else {
            await this.page.keyboard.press("Escape");
          }

          // Wait between actions to avoid detection
          const delay = 2000 + Math.random() * 5000; // 2-7 seconds
          await new Promise((resolve) => setTimeout(resolve, delay));
        } catch (postError) {
          logger.warn(`Error processing post ${i + 1}:`, postError);
          // Continue with next post
        }
      }

      logger.info(`Automation completed for hashtag ${hashtag}:`, results);
      return results;
    } catch (error) {
      logger.error(`Error in automation for hashtag ${hashtag}:`, error);
      throw error;
    }
  }

  async generateAIComment(context: string): Promise<string> {
    try {
      // Use the AI agent to generate contextual comments
      const commentSchema = getInstagramCommentSchema();
      const aiResponse = await runAgent(
        `Generate an engaging, natural comment for a post about ${context}. Make it authentic and conversational.`,
        commentSchema,
      );

      return aiResponse?.comment || `Great content about ${context}! 🚀`;
    } catch (error) {
      logger.warn("AI comment generation failed:", error);
      return `Amazing! Love this content 💯`;
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      logger.info("Instagram service cleaned up");
    } catch (error) {
      logger.error("Error during cleanup:", error);
    }
  }

  private async handleSecurityChecks(): Promise<void> {
    if (!this.page) return;

    try {
      // Handle "Save Your Login Info" popup
      const saveLoginButton = await this.page.$('button:contains("Not Now")');
      if (saveLoginButton) {
        await saveLoginButton.click();
        await this.page.waitForTimeout(2000);
      }

      // Handle "Turn on Notifications" popup
      const notificationButton = await this.page.$(
        'button:contains("Not Now")',
      );
      if (notificationButton) {
        await notificationButton.click();
        await this.page.waitForTimeout(2000);
      }

      // Handle suspicious login attempt
      const suspiciousLogin = await this.page.$('button:contains("It Was Me")');
      if (suspiciousLogin) {
        await suspiciousLogin.click();
        await this.page.waitForTimeout(3000);
      }
    } catch (error) {
      logger.warn("Error handling security checks:", error);
    }
  }
}
