import React, { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { useParams } from "react-router-dom";
import { fetchNetwork } from "api/networks";
import NotificationRow from "components/NotificationRow";
import EditNetwork from "pages/networks/EditNetwork";
import NetworkDetailHeader from "pages/networks/NetworkDetailHeader";
import Loader from "components/Loader";
import { Row } from "@canonical/react-components";
import NetworkDetailOverview from "pages/networks/NetworkDetailOverview";
import CustomLayout from "components/CustomLayout";
import TabLinks from "components/TabLinks";

const tabs: string[] = ["Overview", "Configuration"];

const NetworkDetail: FC = () => {
  const { name, project, activeTab } = useParams<{
    name: string;
    project: string;
    activeTab?: string;
  }>();

  if (!name) {
    return <>Missing name</>;
  }

  if (!project) {
    return <>Missing project</>;
  }

  const { data: network, isLoading } = useQuery({
    queryKey: [queryKeys.projects, project, queryKeys.networks, name],
    queryFn: () => fetchNetwork(name, project),
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <CustomLayout
      header={
        <NetworkDetailHeader network={network} project={project} name={name} />
      }
      contentClassName="edit-network"
    >
      <NotificationRow />
      <Row>
        <TabLinks
          tabs={tabs}
          activeTab={activeTab}
          tabUrl={`/ui/project/${project}/networks/detail/${name}`}
        />
        {!activeTab && (
          <div role="tabpanel" aria-labelledby="overview">
            {network && <NetworkDetailOverview network={network} />}
          </div>
        )}
        {activeTab === "configuration" && (
          <div role="tabpanel" aria-labelledby="configuration">
            {network && <EditNetwork network={network} project={project} />}
          </div>
        )}
      </Row>
    </CustomLayout>
  );
};

export default NetworkDetail;
