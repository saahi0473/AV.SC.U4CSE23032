const TOKEN = "YOUR_ACCESS_TOKEN"; // paste your token

export async function Log(stack, level, pkg, message) {
    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN}`
            },
            body: JSON.stringify({
                stack: stack.toLowerCase(),
                level: level.toLowerCase(),
                package: pkg.toLowerCase(),
                message: message
            })
        });

        const data = await response.json();
        console.log("Log success:", data);

    } catch (error) {
        console.error("Log failed:", error);
    }
}