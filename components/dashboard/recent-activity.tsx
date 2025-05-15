import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "code-review",
      project: "E-commerce App",
      description: "Reviewed pull request #42: Add cart functionality",
      time: "2 hours ago",
      user: {
        name: "Alex Johnson",
        avatar: "/abstract-user-avatar-1.png",
      },
    },
    {
      id: 2,
      type: "code-generation",
      project: "Task Manager",
      description: "Generated API endpoints for user authentication",
      time: "4 hours ago",
      user: {
        name: "You",
        avatar: "/abstract-user-avatar.png",
      },
    },
    {
      id: 3,
      type: "deployment",
      project: "Portfolio Site",
      description: "Deployed v2.3.0 to production",
      time: "Yesterday",
      user: {
        name: "You",
        avatar: "/abstract-user-avatar.png",
      },
    },
    {
      id: 4,
      type: "testing",
      project: "Analytics Dashboard",
      description: "Generated test cases for data visualization components",
      time: "2 days ago",
      user: {
        name: "Sarah Miller",
        avatar: "/abstract-user-avatar-2.png",
      },
    },
    {
      id: 5,
      type: "code-optimization",
      project: "Mobile App",
      description: "Optimized rendering performance for list views",
      time: "3 days ago",
      user: {
        name: "You",
        avatar: "/abstract-user-avatar.png",
      },
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user.name}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                {activity.time} • {activity.project}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
