// api/rooms.js
module.exports = (req, res) => {
    if (req.method === 'POST') {
      // Aquí maneja la lógica para POST
      res.status(200).json({ message: 'Room joined' });
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  };