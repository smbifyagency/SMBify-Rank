import { generateAllWebsiteFiles } from "./client/src/lib/dynamic-website-generator";

const data = {
    businessName: "Test Business",
    heroService: "Test Service",
    heroLocation: "Test Location",
    phone: "123456"
};

try {
    const result = generateAllWebsiteFiles(data as any, "professional");
    console.log("Success! index.html length:", result["index.html"].length);
} catch (error) {
    console.error("Crash during generation:", error);
}
