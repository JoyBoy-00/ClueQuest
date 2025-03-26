
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Clue, makeApiRequest } from '../utils/apiHunt';
import { useCodeHighlight } from '../utils/animations';
import { toast } from 'sonner';

interface ConsoleProps {
  currentClue: Clue;
  onRequestComplete: (response: any) => void;
}

const Console = ({ currentClue, onRequestComplete }: ConsoleProps) => {
  const [endpoint, setEndpoint] = useState(currentClue.endpoint);
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">(currentClue.method);
  const [requestBody, setRequestBody] = useState(
    currentClue.requestBody 
      ? JSON.stringify(currentClue.requestBody, null, 2) 
      : '{}'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  
  // Reset form when clue changes
  useState(() => {
    setEndpoint(currentClue.endpoint);
    setMethod(currentClue.method);
    setRequestBody(
      currentClue.requestBody 
        ? JSON.stringify(currentClue.requestBody, null, 2) 
        : '{}'
    );
    setRequestError(null);
  });
  
  const handleSendRequest = async () => {
    setIsLoading(true);
    setRequestError(null);
    
    try {
      // Check if endpoint matches current clue
      if (endpoint !== currentClue.endpoint) {
        throw new Error("Endpoint doesn't match the current clue");
      }
      
      // Check if method matches current clue
      if (method !== currentClue.method) {
        throw new Error("HTTP method doesn't match the current clue");
      }
      
      // Check if requestBody matches current clue (for POST/PUT)
      if ((method === "POST" || method === "PUT") && currentClue.requestBody) {
        try {
          const parsedBody = JSON.parse(requestBody);
          const expectedBody = currentClue.requestBody;
          
          // Simple deep comparison of objects
          const bodyMatches = JSON.stringify(parsedBody) === JSON.stringify(expectedBody);
          
          if (!bodyMatches) {
            throw new Error("Request body doesn't match the expected pattern");
          }
        } catch (e) {
          throw new Error("Invalid JSON in request body");
        }
      }
      
      await makeApiRequest(
        currentClue,
        (response) => {
          setIsLoading(false);
          onRequestComplete(response);
          toast.success("Request successful!");
        },
        (error) => {
          setIsLoading(false);
          setRequestError(error);
          toast.error("Request failed: " + error);
        }
      );
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setRequestError(errorMessage);
      toast.error("Request failed: " + errorMessage);
    }
  };
  
  // Animation for the code highlighting
  const requestBodyLines = requestBody.split('\n');
  const highlightLine = useCodeHighlight(requestBodyLines.length, 1500);
  
  return (
    <div className="glassmorphism rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-medium">API Console</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value as "GET" | "POST" | "PUT" | "DELETE")}
              className="h-10 rounded-md px-3 py-2 text-sm bg-muted/50 border-0"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          
          <div className="flex-1">
            <Input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="API endpoint"
              className="h-10 console-text"
            />
          </div>
          
          <Button 
            onClick={handleSendRequest} 
            disabled={isLoading}
            className="flex-shrink-0"
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
        
        <Tabs defaultValue="body">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="body">Request Body</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          
          <TabsContent value="body" className="mt-2">
            <div className="rounded-md bg-muted/50 overflow-hidden">
              <div className="p-3 bg-muted/70 text-xs border-b">JSON</div>
              <div className="p-4 font-mono text-sm overflow-auto max-h-48">
                {requestBodyLines.map((line, index) => (
                  <div 
                    key={index} 
                    className={`py-1 ${index === highlightLine ? 'bg-primary/10 -mx-4 px-4' : ''}`}
                  >
                    {line}
                  </div>
                ))}
              </div>
              <div className="p-3 bg-muted/70 text-xs border-t">
                <Textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="font-mono text-sm bg-transparent border-0 p-0 min-h-0 focus-visible:ring-0 resize-none"
                />
              </div>
            </div>
            
            {requestError && (
              <div className="mt-3 p-3 text-sm bg-destructive/10 text-destructive rounded-md border border-destructive/20">
                {requestError}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="help" className="mt-2">
            <div className="rounded-md bg-muted/50 p-4 space-y-3">
              <h3 className="font-medium">Current Clue Hint:</h3>
              <p className="text-sm text-muted-foreground">{currentClue.hint}</p>
              
              <h3 className="font-medium">Expected Parameters:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><span className="font-mono text-primary">Endpoint:</span> {currentClue.endpoint}</li>
                <li><span className="font-mono text-primary">Method:</span> {currentClue.method}</li>
                {currentClue.requestBody && (
                  <li>
                    <span className="font-mono text-primary">Body:</span> 
                    <pre className="mt-1 p-2 bg-muted rounded-md text-xs overflow-auto">
                      {JSON.stringify(currentClue.requestBody, null, 2)}
                    </pre>
                  </li>
                )}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Console;
