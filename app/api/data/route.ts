import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { INITIAL_TASKS, DEFAULT_PREFS } from "@/lib/constants";

const DATA_FILE = path.join(process.cwd(), "data.json");

export async function GET() {
  try {
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File doesn't exist, create it with defaults
      const defaultData = { tasks: INITIAL_TASKS, prefs: DEFAULT_PREFS };
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
      return NextResponse.json(defaultData);
    }
    
    const fileContents = await fs.readFile(DATA_FILE, "utf-8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ tasks: INITIAL_TASKS, prefs: DEFAULT_PREFS });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing data:", error);
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 });
  }
}
