import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const proFeatures = [
  "Private Causal Maps",
  "Advanced Analytics",
  "What-If Simulations",
  "Priority Support",
  "Ad-Free Experience",
];

export default function GoProPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Go Pro with Xyvea</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Unlock powerful features to deepen your research and understanding.
        </p>
      </div>

      <div className="mt-12 flex justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Pro Plan</CardTitle>
            <p className="text-muted-foreground">For professionals and power users</p>
            <div className="mt-4">
              <span className="text-5xl font-extrabold">$10</span>
              <span className="text-xl text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center">
                  <div className="bg-green-500/20 text-green-500 rounded-full p-1 mr-4">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                  {(feature.includes("Analytics") || feature.includes("Simulations")) && (
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Coming Soon</span>
                  )}
                </li>
              ))}
            </ul>
            <Button className="w-full mt-8 text-lg" size="lg">
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
