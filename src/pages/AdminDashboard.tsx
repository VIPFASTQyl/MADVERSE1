import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Trash2, Eye } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);

      if (error) throw error;
      setMessages(messages.filter((msg) => msg.id !== id));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-6xl mx-auto py-20 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            {messages.length} contact message{messages.length !== 1 ? "s" : ""} received
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : messages.length === 0 ? (
          <Card className="p-8 text-center border border-border">
            <p className="text-muted-foreground">No contact messages yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="p-6 border border-border hover:border-foreground/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-2">{message.subject}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <a href={`mailto:${message.email}`} className="hover:text-foreground">
                          {message.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-foreground">From:</span> {message.name}
                      </div>
                      <div>
                        <span className="text-foreground">Date:</span>{" "}
                        {new Date(message.created_at).toLocaleDateString()}{" "}
                        {new Date(message.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="text-foreground/80 line-clamp-2">{message.message}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMessage(message)}
                      className="flex items-center gap-2"
                    >
                      <Eye size={16} />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteId(message.id);
                        setShowDeleteConfirm(true);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMessage(null)}
        >
          <Card
            className="max-w-2xl w-full p-8 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedMessage.subject}</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="text-lg font-semibold">{selectedMessage.name}</p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-primary hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Close
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setDeleteId(selectedMessage.id);
                  setShowDeleteConfirm(true);
                }}
              >
                Delete Message
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
