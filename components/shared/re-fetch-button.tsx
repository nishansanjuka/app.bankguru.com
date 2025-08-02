import { FC } from "react";
import { Button, ButtonProps } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReFetchButtonProps extends ButtonProps {
    isLoading: boolean;
    refetch: () => Promise<void>;
}

export const ReFetchButton: FC<ReFetchButtonProps> = ({ 
    isLoading, 
    refetch, 
    className,
    ...buttonProps 
}) => {
    return (
        <Button 
            disabled={isLoading} 
            onClick={async () => await refetch()} 
            size={'icon'} 
            className={cn('size-8', className)}
            {...buttonProps}
        >
            <RefreshCcw className={cn('p-[2px]', isLoading ? "animate-spin" : "")} />
        </Button>
    );
}