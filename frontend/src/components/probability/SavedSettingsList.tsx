import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ProbabilitySettings {
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  targetReturn: number;
}

interface SavedSettingsListProps {
  settings: ProbabilitySettings[];
  setSettings: React.Dispatch<React.SetStateAction<ProbabilitySettings[]>>;
  presets: ProbabilitySettings[];
}

export function SavedSettingsList({
  settings,
  setSettings,
  presets,
}: SavedSettingsListProps) {
  const { toast } = useToast();

  const handleDeleteSetting = (index: number) => {
    setSettings((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "Setting Removed",
      description: "The setting has been deleted.",
    });
  };

  const handlePresetSelect = (preset: ProbabilitySettings) => {
    const newSetting: ProbabilitySettings = {
      symbol: preset.symbol,
      timeframe: preset.timeframe,
      startDate: preset.startDate,
      endDate: preset.endDate,
      initialBalance: preset.initialBalance,
      targetReturn: preset.targetReturn,
    };
    setSettings((prev) => [...prev, newSetting]);
    toast({
      title: "Preset Added",
      description: `${preset.symbol} added from preset.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {settings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Timeframe</TableHead>
                <TableHead>Target (%)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {settings.map((setting, index) => (
                <TableRow key={index}>
                  <TableCell>{setting.symbol}</TableCell>
                  <TableCell>{setting.timeframe}</TableCell>
                  <TableCell>
                    {(setting.targetReturn * 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSetting(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No settings added yet.</p>
        )}
        <h3 className="text-lg font-medium">Presets</h3>
        <Select
          onValueChange={(value) => {
            const preset = presets.find((p) => p.symbol === value);
            if (preset) handlePresetSelect(preset);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a preset" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.symbol} value={preset.symbol}>
                {preset.symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
