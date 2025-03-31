const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = 3000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL; // Replace with your Discord webhook URL

const LOG_FILE = path.join(__dirname, "webhook_logs.txt");

app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const logEntry = `
-------------------
Timestamp: ${new Date().toISOString()}
Headers: ${JSON.stringify(req.headers, null, 2)}
Body: ${JSON.stringify(req.body, null, 2)}
-------------------
    `;

  // Append to log file
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) {
      console.error("Failed to log data:", err);
    }
  });

  try {
    const { action, data, activity } = req.body;

    // Handle different actions
    let discordMessage;
    
    switch (action) {
      case 'created':
        discordMessage = {
          username: 'Monotone Development',
          embeds: [{
            title: 'New Card Created',
            description: `**${data.name}** added to project`,
            color: convertColor(data.state?.color),
            fields: [
              {
                name: 'Project',
                value: `ID: \`${data.project}\``,
                inline: true
              },
              {
                name: 'State',
                value: data.state?.name || 'N/A',
                inline: true
              },
              {
                name: 'Created By',
                value: `[${activity.actor.display_name}](${activity.actor.avatar_url})`,
                inline: true
              }
            ],
            timestamp: new Date(data.created_at).toISOString(),
            thumbnail: { url: activity?.actor?.avatar_url },
            footer: {
              text: 'Card created'
            }
          }]
        };
        break;

      case 'deleted':
        discordMessage = {
          username: 'Monotone Development',
          embeds: [{
            title: 'Card Deleted',
            description: `Card **${data.id}** has been deleted`,
            color: 0xff4444, // Red color for deletions
            fields: [
              {
                name: 'Deleted By',
                value: `[${activity.actor.display_name}](${activity.actor.avatar_url})`,
                inline: true
              }
            ],
            timestamp: new Date().toISOString(),
            thumbnail: { url: activity?.actor?.avatar_url },
            footer: {
              text: 'Card removed',
            }
          }]
        };
        break;

      case 'updated':
        if (activity?.field === 'state') {
          discordMessage = {
            username: 'Monotone Development',
            embeds: [{
              title: `Card Updated`,
              description: `**${data.name}** moved`,
              color: convertColor(data.state?.color),
              fields: [
                {
                  name: 'State Change',
                  value: `From **${activity.old_value}** to **${activity.new_value}**`,
                  inline: true
                },
                {
                  name: 'Project',
                  value: `ID: \`${data.project}\``,
                  inline: true
                },
                {
                  name: 'Updated By',
                  value: `[${activity.actor.display_name}](${activity.actor.avatar_url})`,
                  inline: true
                }
              ],
              timestamp: new Date(data.updated_at).toISOString(),
              thumbnail: { url: activity?.actor?.avatar_url },
              footer: {
                text: 'Card moved',
              }
            }]
          };
        }
        break;

      default:
        console.log(`Unhandled action: ${action}`);
        return res.sendStatus(200);
    }

    // Send to Discord
    await axios.post(DISCORD_WEBHOOK_URL, discordMessage);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

function getActionDescription(activity) {
  const { field, old_value, new_value } = activity;

  switch (field) {
    case "state_id":
      return `State ID changed from ${old_value} to ${new_value}`;
    case "state":
      return `Moved from **${old_value}** to **${new_value}**`;
    case "sort_order":
      return `Reordered (priority changed)`;
    default:
      return `Field **${field}** updated`;
  }
}

function convertColor(hex) {
  if (!hex) return 0x2f3136; // Default Discord dark gray
  return parseInt(hex.replace("#", ""), 16);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
