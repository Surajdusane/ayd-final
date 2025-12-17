CREATE TABLE "workflowdata" (
	"id" text PRIMARY KEY NOT NULL,
	"data" jsonb,
	"plan" jsonb,
	"work_flow_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflowdata" ADD CONSTRAINT "workflowdata_work_flow_id_workflows_id_fk" FOREIGN KEY ("work_flow_id") REFERENCES "public"."workflows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflowdata" ADD CONSTRAINT "workflowdata_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;