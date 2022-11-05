import CreateChannel from "@/components/channel/CreateChannel";
import SidebarChannel from "@/components/channel/SidebarChannel";
import CreateServerDialog from "@/components/server/create/CreateServerDialog";
import ServerAvatar from "@/components/server/ServerAvatar";
import ManageRolesDialog from "@/components/server/settings/ManageRolesDialog";
import {
  IconSettings,
  IconShield,
  IconUsers,
} from "@/components/ui/icons/Icons";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import SidebarItem from "@/components/ui/sidebar/SidebarItem";
import SidebarLabel from "@/components/ui/sidebar/SidebarLabel";
import SidebarSortButtons from "@/components/ui/sidebar/SidebarSortButtons";
import { VectorLogo } from "@/components/ui/vectors";
import {
  ChannelType,
  ServerPermission,
  useJoinServerMutation,
  useLeaveServerMutation,
} from "@/graphql/hooks";
import { getCategoryIcon } from "@/hooks/getCategoryIcon";
import { useCurrentServer } from "@/hooks/graphql/useCurrentServer";
import { useCurrentUser } from "@/hooks/graphql/useCurrentUser";
import { useHasServerPermissions } from "@/hooks/useHasServerPermissions";
import ctl from "@netlify/classnames-template-literals";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const joinButtonClass = (isJoined, loading) =>
  ctl(`
  ml-auto
  px-3
  h-6
  rounded
  text-13
  font-medium
  focus:outline-none
  ${
    isJoined
      ? "border border-gray-700 text-blue-500"
      : "bg-blue-500 text-primary"
  }
  ${loading ? "opacity-50" : "opacity-100"}
`);

export default function ServerSidebar() {
  const { t } = useTranslation();
  const { server } = useCurrentServer();
  const [currentUser] = useCurrentUser();
  const [editOpen, setEditOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [canManageServer, canViewPrivateChannels] = useHasServerPermissions({
    server,
    permissions: [
      ServerPermission.ManageServer,
      ServerPermission.PrivateChannels,
    ],
  });
  const [joinServer, { loading: joinLoading }] = useJoinServerMutation();
  const [leaveServer, { loading: leaveLoading }] = useLeaveServerMutation();

  const CategoryIcon = getCategoryIcon(server?.category);

  if (!server) return null;
  return (
    <>
      <CreateServerDialog
        open={editOpen}
        setOpen={setEditOpen}
        server={server}
      />

      <ManageRolesDialog
        open={rolesOpen}
        setOpen={setRolesOpen}
        server={server}
        key={server.id}
      />

      <Sidebar>
        {server.bannerUrl ? (
          <div
            className={`h-20 relative bg-center bg-cover bg-no-repeat ${
              server.bannerUrl
                ? ""
                : "bg-gradient-to-br from-red-400 to-indigo-600"
            }`}
            style={
              server.bannerUrl
                ? { backgroundImage: `url(${server.bannerUrl})` }
                : {}
            }
          />
        ) : (
          <div className="h-12 border-b dark:border-gray-850 shadow flex items-center px-5 text-base font-medium">
            <VectorLogo className="h-10" />
          </div>
        )}

        <div className="px-1.5 pt-4">
          <div className="shadow-inner dark:bg-gray-850 bg-gray-300 p-2.5 space-y-2.5 rounded">
            <div className="flex items-center">
              <ServerAvatar
                server={server}
                size={6}
                className="rounded-md mr-2 dark:bg-gray-750"
              />
              <div className="font-semibold text-primary pr-2.5 truncate">
                {server.displayName}
              </div>

              {!!currentUser && currentUser.id !== server.owner.id && (
                <button
                  className={joinButtonClass(
                    server.isJoined,
                    joinLoading || leaveLoading
                  )}
                  type="button"
                  onClick={() => {
                    if (joinLoading || leaveLoading) return;
                    if (server.isJoined) {
                      leaveServer({
                        variables: { input: { serverId: server.id } },
                      });
                    } else {
                      joinServer({
                        variables: { input: { serverId: server.id } },
                      });
                    }
                  }}
                >
                  {server.isJoined ? "Leave" : "Join"}
                </button>
              )}
            </div>
            <div className="text-13 text-secondary pb-1.5">
              {server.description || "No description"}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium flex items-center text-tertiary">
                <IconUsers className="w-4 h-4 mr-2.5" />
                {t("server.memberCount", { count: server.userCount })}{" "}
                {server.userCount === 1 ? "" : "s"}
              </div>
              <div className="text-xs font-medium flex items-center text-tertiary">
                <CategoryIcon className="w-4 h-4 mr-2.5" />
                {t(`category.${server.category}`)}
              </div>
            </div>
          </div>

          <SidebarLabel plusLabel="Create Post">Posts</SidebarLabel>

          <SidebarSortButtons />

          <CreateChannel server={server} />

          <div className="space-y-0.5">
            {server.channels
              .filter((channel) =>
                channel.type === ChannelType.Private
                  ? canViewPrivateChannels
                  : true
              )
              .map((channel) => (
                <SidebarChannel
                  key={channel.id}
                  channel={channel}
                  server={server}
                />
              ))}
          </div>

          {canManageServer && (
            <>
              <SidebarLabel>{t("server.sidebar.admin")}</SidebarLabel>
              <div className="space-y-0.5">
                <SidebarItem onClick={() => setEditOpen(true)}>
                  <IconSettings className="mr-3 w-5 h-5" />
                  {t("server.sidebar.edit")}
                </SidebarItem>
                <SidebarItem onClick={() => setRolesOpen(true)}>
                  <IconShield className="mr-3 w-5 h-5" />
                  {t("server.sidebar.manageRoles")}
                </SidebarItem>
              </div>
            </>
          )}
        </div>
      </Sidebar>
    </>
  );
}
