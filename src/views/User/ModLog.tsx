/*
 * Copyright (C)  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from "react";
import { PaginatedTable } from "PaginatedTable";
import * as moment from "moment";
import { Player } from "Player";
import { Link } from "react-router-dom";
import { chat_markup } from "Chat";

interface ModLogProps {
    user_id: number;
}

export function ModLog(props: ModLogProps): JSX.Element {
    return (
        <PaginatedTable
            className="moderator-log"
            name="moderator-log"
            source={`moderation?player_id=${props.user_id}`}
            pageSizeOptions={[1, 2, 3, 5, 7, 10, 20, 25, 50, 100]}
            uiPushProps={{
                event: `modlog-${props.user_id}-updated`,
                channel: "moderators",
            }}
            columns={[
                {
                    header: "",
                    className: "date",
                    render: (X) => moment(X.timestamp).format("YYYY-MM-DD HH:mm:ss"),
                },
                {
                    header: "",
                    className: "logging-user",
                    render: (X) => {
                        return X?.moderator?.id ? <Player user={X.moderator} /> : "-";
                    },
                },
                {
                    header: "",
                    className: "",
                    render: (X) => (
                        <div>
                            <div className="action">
                                {X.incident_report?.id ? (
                                    <Link to={`/reports-center/all/${X.incident_report.id}`}>
                                        R{X.incident_report.id.toString().substr(-3)}
                                    </Link>
                                ) : null}
                                {X.game ? <Link to={`/game/${X.game.id}`}>{X.game.id}</Link> : null}
                                {X.action}
                            </div>
                            {X.incident_report && (
                                <div>
                                    {X.incident_report.cleared_by_user ? (
                                        <div>
                                            <b>Cleared by user</b>
                                        </div>
                                    ) : null}
                                    <div>{X.incident_report.url}</div>
                                    <div>{X.incident_report.system_note}</div>
                                    <div>{X.incident_report.reporter_note}</div>
                                    {X.incident_report.moderator ? (
                                        <Player user={X.incident_report.moderator} />
                                    ) : null}
                                    <i> {X.incident_report.moderator_note}</i>
                                </div>
                            )}
                            <pre>{chat_markup(X.note, undefined, 1024 * 128)}</pre>
                        </div>
                    ),
                },
            ]}
        />
    );
}
