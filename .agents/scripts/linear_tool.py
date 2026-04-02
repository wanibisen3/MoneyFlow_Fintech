#!/usr/bin/env python3
import os
import sys
import json
import urllib.request
import argparse

LINEAR_API_URL = "https://api.linear.app/graphql"

def query_linear(query, variables=None):
    api_key = os.environ.get("LINEAR_API_KEY")
    if not api_key:
        print("Error: LINEAR_API_KEY environment variable not set.")
        sys.exit(1)

    data = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": api_key
    }

    req = urllib.request.Request(LINEAR_API_URL, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if "errors" in res_data:
                print(f"Linear API Error: {json.dumps(res_data['errors'], indent=2)}")
                sys.exit(1)
            return res_data["data"]
    except Exception as e:
        print(f"Request failed: {e}")
        sys.exit(1)

def create_issue(title, description, team_id):
    query = """
    mutation IssueCreate($title: String!, $description: String, $teamId: String!) {
      issueCreate(input: { title: $title, description: $description, teamId: $teamId }) {
        success
        issue {
          id
          identifier
          url
        }
      }
    }
    """
    variables = {"title": title, "description": description, "teamId": team_id}
    result = query_linear(query, variables)
    return result["issueCreate"]

def get_issue(identifier):
    query = """
    query Issue($id: String!) {
      issue(id: $id) {
        id
        identifier
        title
        description
        state {
          name
        }
      }
    }
    """
    variables = {"id": identifier}
    result = query_linear(query, variables)
    return result["issue"]

def update_issue_priority(identifier, priority):
    query = """
    mutation IssueUpdate($id: String!, $priority: Int!) {
      issueUpdate(id: $id, input: { priority: $priority }) {
        success
        issue {
          id
          identifier
          priority
        }
      }
    }
    """
    variables = {"id": identifier, "priority": priority}
    result = query_linear(query, variables)
    return result["issueUpdate"]

def list_issues(team_id):
    query = """
    query TeamIssues($teamId: String!) {
      team(id: $teamId) {
        issues(first: 50, filter: { state: { name: { neq: "Done" } } }) {
          nodes {
            identifier
            title
            priority
          }
        }
      }
    }
    """
    variables = {"teamId": team_id}
    result = query_linear(query, variables)
    return result["team"]["issues"]["nodes"]

def main():
    parser = argparse.ArgumentParser(description="Linear Integration Tool for AI-POS")
    subparsers = parser.add_subparsers(dest="command")

    # Create Issue
    create_parser = subparsers.add_parser("create", help="Create a new issue")
    create_parser.add_argument("--title", required=True)
    create_parser.add_argument("--description", required=True)
    create_parser.add_argument("--team", required=True, help="Team ID (e.g. from context)")

    # Get Issue
    get_parser = subparsers.add_parser("get", help="Get issue details")
    get_parser.add_argument("--id", required=True, help="Issue identifier (e.g. ENG-123)")

    # List Issues
    list_parser = subparsers.add_parser("list", help="List active issues for a team")
    list_parser.add_argument("--team", required=True)

    # Update Issue Priority
    update_parser = subparsers.add_parser("update", help="Update issue priority")
    update_parser.add_argument("--id", required=True, help="Issue identifier (e.g. ENG-123)")
    update_parser.add_argument("--priority", type=int, required=True, help="Priority (0-4)")

    args = parser.parse_args()

    if args.command == "create":
        res = create_issue(args.title, args.description, args.team)
        print(json.dumps(res, indent=2))
    elif args.command == "get":
        res = get_issue(args.id)
        print(json.dumps(res, indent=2))
    elif args.command == "list":
        res = list_issues(args.team)
        print(json.dumps(res, indent=2))
    elif args.command == "update":
        res = update_issue_priority(args.id, args.priority)
        print(json.dumps(res, indent=2))
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
