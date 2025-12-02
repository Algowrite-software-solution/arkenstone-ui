import DefaultPanelLayout from "@/layouts/panels/default-panel-layout";

export default function TestComponents() {
  return (
    <DefaultPanelLayout breadcrumbs={[
      { title: "Dashboard", href: "/dashboard" },
      { title: "Level 1", href: "/level-1" },
      { title: "Level 2", href: "/level-2" },
      { title: "Level 3", href: "/level-3" },
    ]}>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl">
        
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl"></div>
        <div className="bg-muted/50 aspect-video rounded-xl"></div>
      </div>
      <div className="bg-muted/50 min-h-[100vh]` flex-1 rounded-xl md:min-h-min" />
    </DefaultPanelLayout>
  );
}
