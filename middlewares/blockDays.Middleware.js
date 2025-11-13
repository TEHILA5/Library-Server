export const blockDays = (days, startH, endH) => {
    return (req, res, next) => {
        const date = req.currentDate;
        const day = date.getDay();
        const hour = date.getHours();

        if (days.includes(day)) {
            if (hour >= startH && hour < endH) {
                return res.status(403).json({ message: "The website keep Shabbat!" });
            }
        }

        next();
    };
};
 