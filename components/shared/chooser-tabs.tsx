import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export const ChooserTabs: FC = () => {
  return (
    <div className="container mx-auto w-full">
      <Tabs defaultValue="mortgages" className="w-full">
        <TabsList className="justify-center w-full bg-transparent">
          <TabsTrigger
            value="mortgages"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 rounded-none cursor-pointer"
          >
            Mortgages
          </TabsTrigger>
          <TabsTrigger
            value="credit-cards"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 rounded-none cursor-pointer"
          >
            Credit Cards
          </TabsTrigger>
          <TabsTrigger
            value="personal-loans"
            className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-orange-500 rounded-none cursor-pointer"
          >
            Personal Loans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mortgages">
          {/* Content for Mortgages */}
          <p>Explore various mortgage options</p>
        </TabsContent>

        <TabsContent value="credit-cards">
          {/* Content for Credit Cards */}
          <p>Explore various credit card options</p>
        </TabsContent>

        <TabsContent value="personal-loans">
          {/* Content for Personal Loans */}
          <p>Compare different personal loan options</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};
