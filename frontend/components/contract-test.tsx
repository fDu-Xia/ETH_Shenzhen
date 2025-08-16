"use client";

import { useContentFactory } from "@/hooks/use-content-factory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ContractTest() {
  const { contents, loading, error, contentCount, refreshContents } = useContentFactory();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Contract Connection Test
          <Button onClick={refreshContents} variant="outline" size="sm">
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Badge variant="outline">Content Count</Badge>
            <p className="text-2xl font-bold mt-1">{contentCount}</p>
          </div>
          <div>
            <Badge variant="outline">Status</Badge>
            <p className="text-sm mt-1">
              {loading ? "Loading..." : error ? "Error" : "Connected"}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
            <p className="text-red-400 text-sm">Error: {error}</p>
          </div>
        )}

        {loading && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
            <p className="text-blue-400 text-sm">Loading content from blockchain...</p>
          </div>
        )}

        {contents && contents.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Contents Found:</h3>
            <div className="space-y-2">
              {contents.map((content) => (
                <div key={content.id} className="p-2 bg-gray-800/50 rounded border">
                  <p className="font-medium">ID: {content.id}</p>
                  <p className="text-sm text-gray-400">Creator: {content.creator}</p>
                  <p className="text-sm text-gray-400">Contract: {content.contractAddress}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {contents && contents.length === 0 && !loading && !error && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
            <p className="text-yellow-400 text-sm">
              No content found. The contract might be empty or there might be a connection issue.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
