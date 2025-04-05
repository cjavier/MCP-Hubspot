import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ServerStatusProps {
  status: any;
  isLoading: boolean;
}

export default function ServerStatus({ status, isLoading }: ServerStatusProps) {
  return (
    <div className="mt-10 mb-8">
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            MCP Server Status
          </h3>
          <div className="mt-2 sm:flex sm:items-start sm:justify-between">
            <div className="max-w-xl text-sm text-gray-500">
              <p>
                {isLoading 
                  ? "Loading server status..." 
                  : "Your MCP server is running and ready to accept requests from AI assistants."}
              </p>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
              <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                isLoading 
                  ? "bg-gray-100 text-gray-800" 
                  : "bg-green-100 text-green-800"
              }`}>
                <svg className="-ml-1 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                {isLoading ? "Loading" : "Active"}
              </span>
            </div>
          </div>
          <div className="mt-5 border-t border-gray-200 pt-5">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Server URL</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {isLoading ? <Skeleton className="h-4 w-40" /> : status?.url || "http://localhost:5000"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Uptime</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {isLoading ? <Skeleton className="h-4 w-32" /> : status?.uptime || "N/A"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Total Requests</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {isLoading ? <Skeleton className="h-4 w-16" /> : status?.totalRequests || "0"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Request</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {isLoading ? <Skeleton className="h-4 w-28" /> : status?.lastRequest || "Never"}
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
