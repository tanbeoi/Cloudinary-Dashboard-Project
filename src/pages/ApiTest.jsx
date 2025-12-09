import { useState } from "react";
import { getClient } from "../api/apiClient";

function ApiTest() {
  const [output, setOutput] = useState("");

  async function testMetadata() {
    try {
      const client = getClient();
      const result = await client.getMetadata("Test.jpg"); // use any key you know exists
      setOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setOutput(err.message);
    }
  }

  async function testSignedUrl() {
    try {
      const client = getClient();
      const result = await client.getSignedUrl("Test.jpg");
      setOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setOutput(err.message);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">API Client Test</h1>

      <button
        onClick={testMetadata}
        className="px-3 py-2 bg-emerald-600 rounded"
      >
        Test Metadata
      </button>

      <button
        onClick={testSignedUrl}
        className="px-3 py-2 bg-blue-600 rounded"
      >
        Test Signed URL
      </button>

      <pre className="bg-slate-800 p-4 rounded text-sm overflow-auto">
        {output}
      </pre>
    </div>
  );
}

export default ApiTest;
