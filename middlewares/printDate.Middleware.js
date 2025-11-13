export const printDAte = (req, res, next) => {
    if (req.method === "GET") {
        console.log("Current Date:", req.currentDate);
    }
    next();
};
 