import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useBacktestAPI from "../../hooks/useBacktestAPI";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

// 전략 타입 정의
interface StrategyParameter {
  name: string; // 지표 이름 (예: "Short MA", "RSI")
  value: number | string; // 값
  type: "number" | "select"; // 입력 타입
  options?: string[]; // select일 때 선택지
}

interface CustomStrategy {
  name: string; // 전략 이름
  parameters: StrategyParameter[]; // 사용자 정의 파라미터
}

// 컴포넌트: 파라미터 추가 및 설정
const StrategyParameterEditor: React.FC<{
  parameters: StrategyParameter[];
  onAddParameter: () => void;
  onUpdateParameter: (
    index: number,
    field: keyof StrategyParameter,
    value: string | number
  ) => void;
  onDeleteParameter: (index: number) => void;
}> = ({ parameters, onAddParameter, onUpdateParameter, onDeleteParameter }) => (
  <div className="space-y-4">
    <Button onClick={onAddParameter} className="mb-4">
      Add Parameter
    </Button>
    {parameters.map((param, index) => (
      <div key={index} className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor={`name-${index}`} className="text-gray-200">
            Parameter Name
          </Label>
          <Input
            id={`name-${index}`}
            value={param.name}
            onChange={(e) => onUpdateParameter(index, "name", e.target.value)}
            className="mt-1 bg-gray-800/50 border-gray-700 text-white"
            placeholder="e.g., Short MA"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor={`type-${index}`} className="text-gray-200">
            Type
          </Label>
          <Select
            value={param.type}
            onValueChange={(value) =>
              onUpdateParameter(index, "type", value as "number" | "select")
            }
          >
            <SelectTrigger
              id={`type-${index}`}
              className="mt-1 bg-gray-800/50 border-gray-700 text-white"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="select">Select</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          {param.type === "number" ? (
            <>
              <Label htmlFor={`value-${index}`} className="text-gray-200">
                Value
              </Label>
              <Input
                id={`value-${index}`}
                type="number"
                value={param.value as number}
                onChange={(e) =>
                  onUpdateParameter(index, "value", e.target.valueAsNumber)
                }
                className="mt-1 bg-gray-800/50 border-gray-700 text-white"
              />
            </>
          ) : (
            <>
              <Label htmlFor={`options-${index}`} className="text-gray-200">
                Options (comma-separated)
              </Label>
              <Input
                id={`options-${index}`}
                value={(param.options || []).join(",")}
                onChange={(e) =>
                  onUpdateParameter(index, "options", e.target.value.split(","))
                }
                className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                placeholder="e.g., buy,sell,hold"
              />
              <Label htmlFor={`value-${index}`} className="text-gray-200 mt-2">
                Selected Value
              </Label>
              <Select
                value={param.value as string}
                onValueChange={(value) =>
                  onUpdateParameter(index, "value", value)
                }
              >
                <SelectTrigger
                  id={`value-${index}`}
                  className="mt-1 bg-gray-800/50 border-gray-700 text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {param.options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteParameter(index)}
          className="text-red-400 hover:text-red-500"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    ))}
  </div>
);

export default function StrategyPage() {
  const { toast } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [strategyName, setStrategyName] = useState<string>("");
  const [parameters, setParameters] = useState<StrategyParameter[]>([]);
  const { runBacktest, isLoading } = useBacktestAPI();
  const navigate = useNavigate();

  // 파라미터 추가
  const handleAddParameter = () => {
    setParameters((prev) => [
      ...prev,
      { name: "", type: "number", value: 0 }, // 기본값
    ]);
  };

  // 파라미터 업데이트
  const handleUpdateParameter = (
    index: number,
    field: keyof StrategyParameter,
    value: string | number | string[]
  ) => {
    setParameters((prev) =>
      prev.map((param, i) =>
        i === index ? { ...param, [field]: value } : param
      )
    );
  };

  // 파라미터 삭제
  const handleDeleteParameter = (index: number) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  // 백테스트 실행
  const handleBacktest = async () => {
    if (!strategyName.trim()) {
      toast({
        variant: "destructive",
        title: "Strategy name required",
        description: "Please enter a name for your strategy.",
      });
      return;
    }
    if (parameters.length === 0) {
      toast({
        variant: "destructive",
        title: "No parameters",
        description: "Please add at least one parameter.",
      });
      return;
    }

    try {
      const strategyData = {
        name: strategyName,
        parameters: Object.fromEntries(
          parameters.map((p) => [p.name, p.value])
        ),
      };

      const result = await runBacktest(strategyData);
      if (result) {
        localStorage.setItem(
          "strategyTestResults",
          JSON.stringify([{ name: strategyName, result }])
        );
        navigate("/strategy/results");
      }
    } catch (error) {
      setErrorMessage("Failed to run backtest. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-semibold">Create and Test Strategies</h2>
      <div className="grid grid-cols-1 gap-6">
        {/* 전략 이름 */}
        <div>
          <Label htmlFor="strategyName" className="text-gray-200">
            Strategy Name
          </Label>
          <Input
            id="strategyName"
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            className="mt-1 bg-gray-800/50 border-gray-700 text-white"
            placeholder="e.g., My Custom Strategy"
          />
        </div>

        {/* 파라미터 편집 */}
        <StrategyParameterEditor
          parameters={parameters}
          onAddParameter={handleAddParameter}
          onUpdateParameter={handleUpdateParameter}
          onDeleteParameter={handleDeleteParameter}
        />
      </div>

      <Button onClick={handleBacktest} disabled={isLoading} className="w-full">
        {isLoading ? "Running Backtest..." : "Run Backtest"}
      </Button>

      {errorMessage && (
        <Dialog
          open={!!errorMessage}
          onOpenChange={() => setErrorMessage(null)}
        >
          <DialogContent>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
