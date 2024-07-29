export class Tracer {
  startTrace(name: string): string {
    const traceId = "1234";
    console.log(`Starting trace: ${name}, ID: ${traceId}`);
    return traceId;
  }

  endTrace(traceId: string) {
    console.log(`Ending trace: ${traceId}`);
  }

  setError(error: Error) {
    console.log(`Error in trace: ${error.message}`);
  }
}
