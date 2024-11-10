"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const fs_1 = require("fs");
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const swagger_ui_express_1 = tslib_1.__importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = tslib_1.__importDefault(require("../backend/swagger-output.json"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware to parse request body
app.use(express_1.default.json());
// Add Swagger UI to the app
const options = { swaggerOptions: { tryItOutEnabled: true } };
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default, options));
// Enabled CORS (Cross-Origin Resource Sharing) with number-of-records header option:
app.use((0, cors_1.default)({ exposedHeaders: ["number-of-records"] }));
// Logger middleware: log all requests to the console
app.use((0, morgan_1.default)("dev"));
app.get("/api/friends/:page/:limit/:filter", async (req, res) => {
    // #swagger.tags = ['Friends']
    // #swagger.summary = 'A Jóbarátok sorozatok lekérdezése szűréssel és paginálással'
    // #swagger.parameters['page'] = { example: '1', description: 'Hányadik oldaltól kezdjünk (min: 1)' }
    // #swagger.parameters['limit'] = { example: '3', description: 'Mennyi rekord történjen küldésre oldalanként' }
    // #swagger.parameters['filter'] = { example: 'where', description: 'Csillag karakter (*), ha nincs szűrés.' }
    try {
        const friends = await readDataFromFile("friends");
        let filteredFriends = [];
        if (req.params.filter != "*") {
            const filter = req.params.filter.toLocaleLowerCase();
            filteredFriends = friends.filter(e => e.name.toLowerCase().includes(filter) || e.summary.toLowerCase().includes(filter));
        }
        else {
            filteredFriends = friends;
        }
        const seasons = await readDataFromFile("seasons");
        const page = parseInt(req.params.page);
        const limit = parseInt(req.params.limit);
        const fromIndex = (page - 1) * limit;
        const toIndex = fromIndex + limit;
        res.setHeader("number-of-records", filteredFriends.length);
        res.send(filteredFriends.slice(fromIndex, toIndex).map(ff => {
            const s = seasons.find(s => s.id === ff.seasonId);
            return { ...ff, season: { id: s.id, season: s.season, years: s.years } };
        }));
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
});
// Read operation
// app.get("/read/:id", (req: Request, res: Response) => {
//     const data = readDataFromFile();
//     const item = data.find(item => item.id === parseInt(req.params.id));
//     if (item) {
//         res.send(item);
//     } else {
//         res.status(404).send("Item not found.");
//     }
// });
// Update operation
// app.put("/update/:id", (req: Request, res: Response) => {
//     const data = readDataFromFile();
//     const index = data.findIndex(item => item.id === parseInt(req.params.id));
//     if (index !== -1) {
//         data[index] = req.body;
//         saveDataToFile(data);
//         res.send("Item updated successfully.");
//     } else {
//         res.status(404).send("Item not found.");
//     }
// });
// Delete operation
// app.delete("/delete/:id", (req: Request, res: Response) => {
//     const data = readDataFromFile();
//     const index = data.findIndex(item => item.id === parseInt(req.params.id));
//     if (index !== -1) {
//         data.splice(index, 1);
//         saveDataToFile(data);
//         res.send("Item deleted successfully.");
//     } else {
//         res.status(404).send("Item not found.");
//     }
// });
app.listen(PORT, () => {
    console.log(`Jedlik Json-Backend-Server Swagger: http://localhost:${PORT}/docs`);
});
// Utility functions to read/write data from/to file
async function readDataFromFile(table) {
    try {
        const data = await fs_1.promises.readFile(`db_${table}.json`, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        return [error.message];
    }
}
// async function saveDataToFile(table: string, data: any[]): Promise<string> {
//     try {
//         await fs.writeFile(`db_${table}.json`, JSON.stringify(data, null, 2), "utf8");
//         return "OK";
//     } catch (error) {
//         return error.message;
//     }
// }
//# sourceMappingURL=backend.js.map