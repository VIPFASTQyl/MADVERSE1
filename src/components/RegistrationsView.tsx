import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  user_id: string;
  activity_id: string;
  status: "registered" | "completed" | "cancelled";
  registered_at: string;
  completed_at: string | null;
  user_email?: string;
  activity_title?: string;
}

export const RegistrationsView = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      // Fetch registrations with user info from auth table
      const { data: registrationsData, error: regError } = await supabase
        .from("activity_registrations")
        .select(
          `
          id,
          user_id,
          activity_id,
          status,
          registered_at,
          completed_at
        `
        )
        .order("registered_at", { ascending: false });

      if (regError) throw regError;

      if (registrationsData && registrationsData.length > 0) {
        const registrationsWithDetails = await Promise.all(
          registrationsData.map(async (reg) => {
            // Get user from user_profiles table instead
            const { data: profileData } = await supabase
              .from("user_profiles")
              .select("full_name")
              .eq("id", reg.user_id)
              .maybeSingle();

            // Get activity title
            const { data: activityData } = await supabase
              .from("activity_content")
              .select("title")
              .eq("id", reg.activity_id)
              .maybeSingle();

            return {
              ...reg,
              user_email: profileData?.full_name || "Unknown User",
              activity_title: activityData?.title || "Unknown Program",
            };
          })
        );

        setRegistrations(registrationsWithDetails);
      } else {
        setRegistrations([]);
      }
    } catch (error) {
      console.error("Error loading registrations:", error);
      toast({
        title: "Error",
        description: "Failed to load registrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "registered":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Registrations</h2>
        <p className="text-muted-foreground">
          View all user registrations for programs
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Total Registrations: {registrations.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No registrations yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered Date</TableHead>
                    <TableHead>Completed Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">
                        {reg.user_email}
                      </TableCell>
                      <TableCell>{reg.activity_title}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reg.status)}>
                          {reg.status.charAt(0).toUpperCase() +
                            reg.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(reg.registered_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {reg.completed_at
                          ? new Date(reg.completed_at).toLocaleDateString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
