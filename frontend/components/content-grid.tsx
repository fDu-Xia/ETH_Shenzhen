import { ContentCard } from "@/components/content-card";
import { useContentFactory } from "@/hooks/use-content-factory";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

export function ContentGrid() {
  const { contents, loading, error, contentCount, refreshContents } =
    useContentFactory();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-400">
          Loading content from blockchain and IPFS...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          This may take a few moments for the first load
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-400 mb-4">Error loading content: {error}</p>
        <Button onClick={refreshContents} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!contents || contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Content Found
          </h3>
          <p className="text-gray-400 mb-4">
            {contentCount === 0
              ? "The blockchain is ready but no content has been created yet. Be the first to create content!"
              : "No content available to display at the moment."}
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>
              • Content will appear here once creators publish to the blockchain
            </p>
            <p>• Each piece of content becomes a unique token</p>
            <p>• Connect your wallet to start creating content</p>
          </div>
          <Button onClick={refreshContents} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with content count and refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Available Content ({contentCount})
          </h2>
          <p className="text-gray-400 text-sm">
            Showing first {contents.length} of {contentCount} contents
          </p>
        </div>
        <Button onClick={refreshContents} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {contents.slice(2).map((content) => (
          <div key={content.id} className="p-2">
            <ContentCard content={content} />
          </div>
        ))}
      </div>
    </div>
  );
}
