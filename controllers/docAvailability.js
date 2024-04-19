const fs = require("fs");
const availabilityData = JSON.parse(fs.readFileSync("availability.json", "utf-8"));

function getDayOfWeek(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
}

function getNextAvailableSlot(date, time, availability) {
    let nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    while (!availabilityData.availabilityTimings[getDayOfWeek(nextDay)] ||
        availabilityData.availabilityTimings[getDayOfWeek(nextDay)].length === 0) {
        nextDay.setDate(nextDay.getDate() + 1);
    }

    return {
        date: nextDay.toISOString().split('T')[0], // Convert to "YYYY-MM-DD" format
        time: availabilityData.availabilityTimings[getDayOfWeek(nextDay)][0].start
    };
}

const isAvailable = (date, time) => {
    const dayOfWeek = getDayOfWeek(date);
    const availability = availabilityData.availabilityTimings[dayOfWeek];

    if (!availability || availability.length === 0) {
        return {
            isAvailable: false,
            nextAvailableSlot: getNextAvailableSlot(date, time, availability),
        };
    }

    const givenTime = new Date(`${date}T${time}`);
    for (const slot of availability) {
        const startTime = new Date(`${date}T${slot.start}`);
        const endTime = new Date(`${date}T${slot.end}`);

        if (givenTime >= startTime && givenTime <= endTime) {
            return { isAvailable: true };
        }
    }

    return {
        isAvailable: false,
        nextAvailableSlot: getNextAvailableSlot(date, time, availability),
    };
};

const checkAvailability = async (req, res) => {
    const { date, time } = req.query;

    if (!date || !time) {
        return res.status(400).json({ error: "Both date and time parameters are required." });
    }

    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
    const isValidTime = /^\d{2}:\d{2}$/.test(time);

    if (!isValidDate || !isValidTime) {
        return res.status(400).json({
            error: "Invalid date or time format. Date should be in 'YYYY-MM-DD' format and time should be in 'HH:MM' format."
        });
    }

    const result = isAvailable(date, time);
    return res.status(200).json(result);
};

module.exports = { checkAvailability };
