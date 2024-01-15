export const getController = (req, res, payload) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: `Hi! ${req.socket.remoteAddress}`, payload }));
  };
  
export const postController = (req, res, payload) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ user: payload }));
  };
  
export const optionsController = (req, res) => {
    res.setHeader('Allow', 'OPTIONS, GET, POST');
    res.setHeader('Content-Type', 'text/plain');
    res.end('Ok');
  };
  