import {Card} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose} from "@/components/ui/dialog";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger,SelectValue} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field"

export default function HabitCard() {
    return (
        <Card className="w-93 h-130 flex justify-end flex-row">
            <Dialog>
                <DialogTrigger asChild>   
                    {/* Button on the card that opens the modal */}
                    <Button className="w-10 h-10 mr-4 bg-gray-100"> 
                        <PlusIcon className="text-black size-6"/>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-black-200">Add a Habit</DialogTitle>
                    </DialogHeader>
                    <Textarea placeholder="Enter habit name" className="w-90 min-h-5" rows={1} /> {/* This text area is used for entering the habit name */}
                    {/* Select timeliness */}
                    <Select>
                        <SelectTrigger className="w-50 mt-10">
                            <SelectValue placeholder="Timeliness" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {/* Select Difficulty */}
                    <Select>
                        <SelectTrigger className="w-50">
                            <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="trivial">Trivial</SelectItem>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {/* Select Category */}
                    <Select>
                        <SelectTrigger className="w-50 mb-10">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="sports">Sports</SelectItem>
                                <SelectItem value="study">Study</SelectItem>
                                <SelectItem value="skills">Skills</SelectItem>
                                <SelectItem value="chores">Chores</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {/* Notes field */}
                    <Field>
                        <FieldLabel htmlFor="textarea-message">Notes</FieldLabel>
                        <FieldDescription>Enter notes for your habit below.</FieldDescription>
                        <Textarea id="textarea-message" placeholder="Type your notes here." />
                    </Field>
                    <DialogFooter>
                        <DialogClose asChild>
                        <div className="flex justify-center w-full">
                            <Button className="w-30 h-10 bg-gray-200 text-black">Submit</Button>
                        </div>
                        </DialogClose>

                        
                    </DialogFooter>
                </DialogContent>

            </Dialog>

        </Card>
    )
}