require('dotenv').config({ path: '.env.webhook' });
const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9000;
const SECRET = process.env.WEBHOOK_SECRET; // You'll need to set this

app.use(express.json());

// Verify GitHub webhook signature
function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', SECRET);
  const calculatedSignature = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature));
}

app.post('/deploy', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  
  // Verify the webhook signature
  if (!signature || !verifySignature(JSON.stringify(req.body), signature)) {
    return res.status(401).send('Invalid signature');
  }

  // Only deploy on push to main branch
  if (req.body.ref === 'refs/heads/main') {
    console.log('Deploying...');
    
    // Make the script executable and run it
    const scriptPath = path.join(__dirname, 'deploy.sh');
    exec(`chmod +x ${scriptPath} && ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Deployment error: ${error}`);
        console.error(`stderr: ${stderr}`);
        return res.status(500).send('Deployment failed');
      }
      console.log(`Deployment output: ${stdout}`);
      res.send('Deployment successful');
    });
  } else {
    res.send('Ignored event - not a push to main');
  }
});

app.listen(PORT, () => {
  console.log(`Deploy webhook server running on port ${PORT}`);
}); 