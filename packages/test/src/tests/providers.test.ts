import dotenv from "dotenv";
import { zeroUuid } from "../test_resources/constants.js";
import { createRuntime } from "../test_resources/createRuntime.js";
import {
    IAgentRuntime,
    type Memory,
    type Provider,
    type State,
    type UUID,
} from "@ai16z/eliza";

dotenv.config({ path: ".dev.vars" });

const TestProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        return "Hello Test";
    },
};

describe("TestProvider", () => {
    let runtime: IAgentRuntime;
    let roomId: UUID;

    beforeAll(async () => {
        const setup = await createRuntime({
            env: process.env as Record<string, string>,
            providers: [TestProvider],
        });
        runtime = setup.runtime;
        roomId = zeroUuid;
    });

    test("TestProvider should return 'Hello Test'", async () => {
        const message: Memory = {
            userId: zeroUuid,
            content: { text: "" },
            agentId: zeroUuid,
            roomId: roomId,
        };

        const testProviderResponse = await TestProvider.get(
            runtime,
            message,
            {} as State
        );
        expect(testProviderResponse).toBe("Hello Test");
    });

    test("TestProvider should be integrated in the runtime providers", async () => {
        expect(runtime.providers).toContain(TestProvider);
    });
});