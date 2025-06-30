import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800";
    if (score >= 60) return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
    return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Image src="/star.svg" width={32} height={32} alt="feedback" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Interview Feedback
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            <span className="capitalize font-semibold">{interview.role}</span> Position
          </p>
        </div>

        {/* Overview Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Overall Score */}
            <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${getScoreBgColor(feedback?.totalScore || 0)}`}>
              <div className="flex items-center justify-center w-12 h-12 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                <Image src="/star.svg" width={24} height={24} alt="star" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(feedback?.totalScore || 0)}`}>
                  {feedback?.totalScore || 0}/100
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full">
                <Image src="/calendar.svg" width={20} height={20} alt="calendar" />
              </div>
              <div>
                <p className="text-sm font-medium">Interview Date</p>
                <p className="text-sm">
                  {feedback?.createdAt
                    ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Assessment */}
        {feedback?.finalAssessment && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Summary Assessment
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
              {feedback.finalAssessment}
            </p>
          </div>
        )}

        {/* Category Breakdown */}
        {feedback?.categoryScores && feedback.categoryScores.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Performance Breakdown
            </h2>
            <div className="space-y-4">
              {feedback.categoryScores.map((category, index) => (
                <div key={index} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 hover:shadow-md dark:hover:shadow-slate-700/50 transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(category.score)} ${getScoreBgColor(category.score)}`}>
                      {category.score}/100
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {category.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths and Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          {feedback?.strengths && feedback.strengths.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Strengths
              </h3>
              <ul className="space-y-3">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {feedback?.areasForImprovement && feedback.areasForImprovement.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {feedback.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 h-12 rounded-lg font-semibold transition-colors">
            <Link href="/" className="flex w-full justify-center items-center">
              Back to Dashboard
            </Link>
          </Button>

          <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-lg font-semibold transition-colors">
            <Link
              href={`/interview/${id}`}
              className="flex w-full justify-center items-center"
            >
              Retake Interview
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;