import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import { Badge } from "@/components/atoms/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/molecules/Card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <Badge variant="default">Powered by Stellar</Badge>
        <Text variant="h1">FarmCredit</Text>
        <Text variant="muted" className="max-w-md">
          Decentralized agricultural credit platform built on the Stellar network.
        </Text>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Connect your wallet to access farm credit services.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button variant="default" size="lg" className="w-full">
            Connect Wallet
          </Button>
          <Button variant="outline" size="lg" className="w-full">
            Learn More
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
