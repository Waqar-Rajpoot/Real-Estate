import dbConnect from "@/lib/dbConnect";
import Lead from "@/models/Lead.model";

export default async function AdminLeadsPage() {
  await dbConnect();

  const leads = await Lead.find({ status: "New" })
    .populate("propertyId", "title city price")
    .populate("agentId", "name phoneNumber")
    .sort({ createdAt: -1 })
    .lean();

  const serialized = JSON.parse(JSON.stringify(leads));

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">New WhatsApp Leads</h1>
      <div className="flex flex-col gap-4">
        {serialized.map((lead) => (
          <div
            key={lead._id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            <p className="font-semibold text-gray-900">
              {lead.propertyId?.title || "Unknown property"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {lead.propertyId?.city} · {lead.channel} ·{" "}
              {new Date(lead.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Agent: {lead.agentId?.name || "Unassigned"}
            </p>
            <div className="mt-4 flex gap-3">
              <span
                className="text-xs bg-yellow-100 text-yellow-700
                            px-3 py-1 rounded-full font-medium"
              >
                {lead.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
