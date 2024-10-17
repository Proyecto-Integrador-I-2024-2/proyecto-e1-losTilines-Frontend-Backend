import routes from "@/routes";
import { Route, Routes } from "react-router-dom";
import { NavigationTopBar, ProjectTopBar } from "@/widgets/layout";
import { SimpleFooter } from "@/widgets/footer";


export function ProjectLayout() {
  return (
    <div className="flex flex-col min-h-screen h-screen md:h-screen  overflow">
      <NavigationTopBar />
      <ProjectTopBar> </ProjectTopBar>


      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "project" &&
            pages.map(({ element, path }) => (
              <Route path={path} element={element} />
            ))
        )}
      </Routes>

    </div>
  );
}

export default ProjectLayout;
