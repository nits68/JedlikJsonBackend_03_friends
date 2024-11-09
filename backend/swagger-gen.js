"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_autogen_1 = tslib_1.__importDefault(require("swagger-autogen"));
const doc = {
    info: {
        version: "1.0.0", // by default: '1.0.0'
        title: "Jedlik REST API Server for 'Kilátók'", // by default: 'REST API'
        description: "", // by default: ''
    },
    servers: [
        {
            url: "http://localhost:3000", // by default: 'http://localhost:3000'
            description: "", // by default: ''
        },
        // { ... }
    ],
    tags: [
        // by default: empty Array
        {
            name: "", // Tag name
            description: "", // Tag description
        },
        // { ... }
    ],
    components: {}, // by default: empty object
};
const outputFile = "./swagger-output.json";
const routes = ["./backend.js"];
/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
(0, swagger_autogen_1.default)({ openapi: "3.0.0" })(outputFile, routes, doc);
//# sourceMappingURL=swagger-gen.js.map