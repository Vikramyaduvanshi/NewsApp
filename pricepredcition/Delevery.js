const axios = require('axios');

function getLastNDates(n) {
    let dates = [];
    let i = 0;
    while (dates.length < n) {
        let d = new Date();
        d.setDate(d.getDate() - i);
        let dd = String(d.getDate()).padStart(2, '0');
        let mm = String(d.getMonth() + 1).padStart(2, '0');
        let yyyy = d.getFullYear();
        dates.push(`${dd}${mm}${yyyy}`);
        i++;
    }
    return dates;
}

async function Delevery(symbol) {
    const last15Days = getLastNDates(15); // Safety ke liye 15 din
    let historicalData = [];

    for (let date of last15Days) {
        if (historicalData.length >= 7) break; 

        const url = `https://nsearchives.nseindia.com/archives/equities/mto/MTO_${date}.DAT`;
        
        try {
            const response = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 5000
            });

            const lines = response.data.split('\n');
            for (let line of lines) {
                const cols = line.split(',');
                if (cols.length > 6 && cols[2]?.trim() === symbol.toUpperCase() && cols[3]?.trim() === 'EQ') {
                    historicalData.push({
                        date: date.replace(/(\d{2})(\d{2})(\d{4})/, '$1-$2-$3'),
                        tradedQty: parseInt(cols[4].trim()),
                        deliveryQty: parseInt(cols[5].trim()),
                        deliveryPercentage: parseFloat(cols[6].trim())
                    });
                    break;
                }
            }
        } catch (e) {
            // Holiday cases
        }
    }

    if (historicalData.length > 0) {
        historicalData.reverse();

        const avgDelivery = historicalData.reduce((acc, curr) => acc + curr.deliveryPercentage, 0) / historicalData.length;
        const latest = historicalData[historicalData.length - 1];
        
        const finalPayload = {
            symbol: symbol,
            analysisDate: new Date().toLocaleDateString(),
            avg7DayDelivery: avgDelivery.toFixed(2),
            currentDelivery: latest.deliveryPercentage,
            momentum: latest.deliveryPercentage > avgDelivery ? "INCREASING" : "DECREASING",
            dataPoints: historicalData
        };

        // CRITICAL FIX: Return statement add kiya
        return finalPayload; 
        
    } else {
        return null;
    }
}

// Module export bilkul sahi hai
module.exports = Delevery;

// Run karne ka sahi tarika
async function run (){
    let ans = await Delevery("SWIGGY");
    console.log("Delivery Data Result:", ans); // Ab yeh undefined nahi aayega
}

// run();