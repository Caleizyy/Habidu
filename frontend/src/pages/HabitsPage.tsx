import HabitCard from "@/components/habits/HabitCard"

export default function HabitsPage() {
    return (
        <div className="flex flex-col flex-1">
            <h1 className="text-black flex justify-start text-6xl ml-12 mt-12">Goals</h1>
            <div className="flex flex-col flex-1 justify-end ml-12 mb-4">
            <div className="grid grid-cols-3 gap-16">
                 <HabitCard></HabitCard>
                <HabitCard></HabitCard>
                <HabitCard></HabitCard>
            </div>
        </div>
        </div>
        
        
    )
}
