import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User as DBUser } from "@/lib/types/database"

interface UsersTableProps {
  users: DBUser[]
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-muted-foreground">Manage registered users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{user.full_name || "No name"}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">No users yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
