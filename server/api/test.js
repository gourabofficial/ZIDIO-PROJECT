// Simple test endpoint for Vercel
export default function handler(req, res) {
  res.status(200).json({ 
    message: "Test API endpoint working",
    method: req.method,
    timestamp: new Date().toISOString()
  });
}
