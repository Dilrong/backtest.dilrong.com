import { Card, CardHeader, CardContent } from "@/components/ui/card";
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

interface MonteCarloSettings {
  symbol: string;
  timeframe: string;
  initialBalance: number;
  targetReturn: number;
  days: number;
}

interface MonteCarloSavedSettingsListProps {
  settings: MonteCarloSettings[];
  setSettings: React.Dispatch<React.SetStateAction<MonteCarloSettings[]>>;
  presets: { name: string } & MonteCarloSettings[];
}

export function MonteCarloSavedSettingsList({
  settings,
  setSettings,
  presets,
  toast,
}: MonteCarloSavedSettingsListProps) {
  const handleDeleteSetting = (index: number) => {
    setSettings((prev) => prev.filter((_, i) => i !== index));
    toast({
      title: "Setting Removed",
      description: "The setting has been deleted.",
    });
  };

  const handlePresetSelect = (preset: MonteCarloSettings) => {
    const newSetting: MonteCarloSettings = {
      symbol: preset.symbol,
      timeframe: preset.timeframe,
      initialBalance: preset.initialBalance,
      targetReturn: preset.targetReturn,
      days: preset.days,
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
        <h3 className="text-lg font-medium">Saved Settings</h3>
      </CardHeader>
      <CardContent>
        {settings.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Timeframe</TableHead>
                <TableHead>Target (%)</TableHead>
                <TableHead>Days</TableHead>
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
                  <TableCell>{setting.days}</TableCell>
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
            const preset = presets.find((p) => p.name === value);
            if (preset) handlePresetSelect(preset);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a preset" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.name} value={preset.name}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
