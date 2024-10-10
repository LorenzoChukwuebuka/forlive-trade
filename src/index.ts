import App from "./api/v1/app";
const app = new App();
app.start().catch(error => {
    console.error("Application failed to start:", error);
    process.exit(1);
});