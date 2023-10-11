type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type InputTag = "input" | "textarea";
type Field = InputTag | { [key: string]: Field };
type Fields = Record<string, Field>;

type operation = {
  name: string;
  endpoint: string;
  method: HttpMethod;
  fields: Fields;
};

const operations: operation[] = [
  {
    name: "Get Session User (logged in user)",
    endpoint: "/api/session",
    method: "GET",
    fields: {},
  },
  {
    name: "Create User",
    endpoint: "/api/users",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Login",
    endpoint: "/api/login",
    method: "POST",
    fields: { username: "input", password: "input" },
  },
  {
    name: "Logout",
    endpoint: "/api/logout",
    method: "POST",
    fields: {},
  },
  {
    name: "Update User",
    endpoint: "/api/users",
    method: "PATCH",
    fields: { update: { username: "input", password: "input" } },
  },
  {
    name: "Delete User",
    endpoint: "/api/users",
    method: "DELETE",
    fields: {},
  },
  {
    name: "Get Users (empty for all)",
    endpoint: "/api/users/:username",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Get Friends (current session user)",
    endpoint: "/api/friends",
    method: "GET",
    fields: {},
  },
  {
    name: "Remove Friend",
    endpoint: "/api/friend/:friend",
    method: "DELETE",
    fields: { friend: "input" },
  },
  {
    name: "Get Requests",
    endpoint: "/api/friend/requests",
    method: "GET",
    fields: {},
  },
  {
    name: "Send Friend Request",
    endpoint: "/api/friend/requests/:to",
    method: "POST",
    fields: { to: "input" },
  },
  {
    name: "Remove Friend Request",
    endpoint: "/api/friend/requests/:to",
    method: "DELETE",
    fields: { to: "input" },
  },
  {
    name: "Accept Friend Request",
    endpoint: "/api/friend/accept/:from",
    method: "PUT",
    fields: { from: "input" },
  },
  {
    name: "Reject Friend Request",
    endpoint: "/api/friend/reject/:from",
    method: "PUT",
    fields: { from: "input" },
  },
  {
    name: "Get Posts (empty for all)",
    endpoint: "/api/posts",
    method: "GET",
    fields: { author: "input" },
  },
  {
    name: "Create Post",
    endpoint: "/api/posts",
    method: "POST",
    fields: { content: "input" },
  },
  {
    name: "Update Post",
    endpoint: "/api/posts/:id",
    method: "PATCH",
    fields: { id: "input", update: { content: "input", options: { backgroundColor: "input" } } },
  },
  {
    name: "Delete Post",
    endpoint: "/api/posts/:id",
    method: "DELETE",
    fields: { id: "input" },
  },

  {
    name: "Create Status (current session user)",
    endpoint: "/api/status/:user",
    method: "POST",
    fields: {},
  },
  {
    name: "Get Status",
    endpoint: "/api/status",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Update Status (current session user)",
    endpoint: "/api/status/:user",
    method: "PUT",
    fields: { newStatus: "input" },
  },
  {
    name: "Create FocusScore (current session user)",
    endpoint: "/api/FocusScores/:user",
    method: "POST",
    fields: {},
  },
  {
    name: "Get FocusScore",
    endpoint: "/api/FocusScore",
    method: "GET",
    fields: { username: "input" },
  },
  {
    name: "Set FocusScore (current session user)",
    endpoint: "/api/FocusScore/set/:user",
    method: "PUT",
    fields: { points: "input" },
  },
  {
    name: "Update FocusScore",
    endpoint: "/api/FocusScore/update/:username",
    method: "PUT",
    fields: { username: "input", points: "input" },
  },
  {
    name: "Create room (current session user)",
    endpoint: "/api/rooms/:user",
    method: "POST",
    fields: {},
  },
  {
    name: "Get room",
    endpoint: "/api/rooms",
    method: "GET",
    fields: { hostName: "input" },
  },
  {
    name: "Get occupants of a room",
    endpoint: "/api/room/occupants",
    method: "GET",
    fields: { hostName: "input" },
  },
  {
    name: "Add user to personal room",
    endpoint: "/api/room/occupants/:username",
    method: "PUT",
    fields: { username: "input" },
  },
  {
    name: "Remove user from personal room",
    endpoint: "/api/room/occupants/remove/:username",
    method: "PUT",
    fields: { username: "input" },
  },
  {
    name: "Get Tasks (current user)",
    endpoint: "/api/tasks",
    method: "GET",
    fields: {},
  },
  {
    name: "Create Task (current user)",
    endpoint: "/api/tasks/create/:user",
    method: "POST",
    fields: { title: "input", due: "input" },
  },
  {
    name: "Update Task",
    endpoint: "/api/task/update/:_id",
    method: "PATCH",
    fields: { _id: "input", update: { title: "input", due: "input", completionStatus: "input" } },
  },
  {
    name: "Create TimedResource",
    endpoint: "/api/Timers/:_id",
    method: "POST",
    fields: { _id: "input", duration: "input" },
  },
  {
    name: "Get TimedResource (enter resource ID)",
    endpoint: "/api/Timers",
    method: "GET",
    fields: { _id: "input" },
  },
  {
    name: "Start Timed Resource",
    endpoint: "/api/Timers/startTimer/:_id",
    method: "PUT",
    fields: { _id: "input" },
  },
  {
    name: "Reset Timed Resource",
    endpoint: "/api/Timers/reset/:_id",
    method: "PUT",
    fields: { _id: "input" },
  },
  {
    name: "Update Timed Resource",
    endpoint: "/api/Timers/updateTimer/:_id",
    method: "PATCH",
    fields: { _id: "input", update: { duration: "input", completedStatus: "input" } },
  },
  {
    name: "Get Leaderboard",
    endpoint: "/api/leaderboard",
    method: "GET",
    fields: {},
  },
];

// Do not edit below here.
// If you are interested in how this works, feel free to ask on forum!

function updateResponse(code: string, response: string) {
  document.querySelector("#status-code")!.innerHTML = code;
  document.querySelector("#response-text")!.innerHTML = response;
}

async function request(method: HttpMethod, endpoint: string, params?: unknown) {
  try {
    if (method === "GET" && params) {
      endpoint += "?" + new URLSearchParams(params as Record<string, string>).toString();
      params = undefined;
    }

    const res = fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: params ? JSON.stringify(params) : undefined,
    });

    return {
      $statusCode: (await res).status,
      $response: await (await res).json(),
    };
  } catch (e) {
    console.log(e);
    return {
      $statusCode: "???",
      $response: { error: "Something went wrong, check your console log.", details: e },
    };
  }
}

function fieldsToHtml(fields: Record<string, Field>, indent = 0, prefix = ""): string {
  return Object.entries(fields)
    .map(([name, tag]) => {
      return `
        <div class="field" style="margin-left: ${indent}px">
          <label>${name}:
          ${typeof tag === "string" ? `<${tag} name="${prefix}${name}"></${tag}>` : fieldsToHtml(tag, indent + 10, prefix + name + ".")}
          </label>
        </div>`;
    })
    .join("");
}

function getHtmlOperations() {
  return operations.map((operation) => {
    return `<li class="operation">
      <h3>${operation.name}</h3>
      <form class="operation-form">
        <input type="hidden" name="$endpoint" value="${operation.endpoint}" />
        <input type="hidden" name="$method" value="${operation.method}" />
        ${fieldsToHtml(operation.fields)}
        <button type="submit">Submit</button>
      </form>
    </li>`;
  });
}

function prefixedRecordIntoObject(record: Record<string, string>) {
  const obj: any = {}; // eslint-disable-line
  for (const [key, value] of Object.entries(record)) {
    if (!value) {
      continue;
    }
    const keys = key.split(".");
    const lastKey = keys.pop()!;
    let currentObj = obj;
    for (const key of keys) {
      if (!currentObj[key]) {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    currentObj[lastKey] = value;
  }
  return obj;
}

async function submitEventHandler(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const { $method, $endpoint, ...reqData } = Object.fromEntries(new FormData(form));

  // Replace :param with the actual value.
  const endpoint = ($endpoint as string).replace(/:(\w+)/g, (_, key) => {
    const param = reqData[key] as string;
    delete reqData[key];
    return param;
  });

  const data = prefixedRecordIntoObject(reqData as Record<string, string>);

  updateResponse("", "Loading...");
  const response = await request($method as HttpMethod, endpoint as string, Object.keys(data).length > 0 ? data : undefined);
  updateResponse(response.$statusCode.toString(), JSON.stringify(response.$response, null, 2));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#operations-list")!.innerHTML = getHtmlOperations().join("");
  document.querySelectorAll(".operation-form").forEach((form) => form.addEventListener("submit", submitEventHandler));
});
