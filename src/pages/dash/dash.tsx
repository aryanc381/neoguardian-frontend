import { Card, Flex, Heading, Input, Text } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"
import  { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Chart, useChart } from "@chakra-ui/charts"
import { Avatar } from "@chakra-ui/react"
import { AvatarGroup } from "@chakra-ui/react"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable"
import Vapi from '@vapi-ai/web';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
} from "recharts"

function Dashboard() {
  return (
    <Flex>
      <Toaster />
        <Flex direction={"column"}>
            <PatientInfo />
            <Helpline />
            <Tools />
            <Report />
        </Flex>
        <Flex direction={"column"}>
          <Flex direction={"row"}>
            <BreathingExerciseCard />
            <Info />
          
          </Flex>
          <Analysis />
        </Flex>
        
    </Flex>
  )
}

function PatientInfo() {
    return(
        <Flex>
        <Card.Root size="lg" width={{md: "30vw"}} mt={{md: "1vw"}} ml={{md: "1vw"}} letterSpacing={{md: "-0.04vw"}}>
            <Card.Header>
            <Heading size="2xl">Patient Information</Heading>
            </Card.Header>
            <Card.Body color="fg.muted" mt={{md: "-1vw"}} fontSize={{md: "1.2vw"}}>
                <p>Patient Name: <span className="text-white">Abhishek Tiwari</span></p>
                <p>Patient Email Address: <span className="text-white">abhishek@gmail.com</span></p>
                <p>Patient Phone: <span className="text-white">9049122622</span></p>
            </Card.Body>
        </Card.Root>
        </Flex> 
    )
}

function Helpline() {
    return(
        <Flex>
        <Card.Root size="lg" width={{md: "30vw"}} mt={{md: "1vw"}} ml={{md: "1vw"}} letterSpacing={{md: "-0.20vw"}}>
            <Card.Body color="fg.success" fontWeight={"350"} fontSize={{md: "3.5vw"}}>
                <p>Help: <span>1800 891 4416</span></p>
            </Card.Body>
        </Card.Root>
        </Flex> 
    )
}

import {

  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { Toaster, toaster } from "../../components/ui/toaster";


function Tools() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>(
    {}
  );

  const screeningTools: Record<string, { title: string; questions: string[] }> = {
    "PHQ-9": {
      title: "Patient Health Questionnaire-9",
      questions: [
        "Little interest or pleasure in doing things?",
        "Feeling down, depressed, or hopeless?",
        "Trouble falling or staying asleep, or sleeping too much?",
        "Feeling tired or having little energy?",
        "Poor appetite or overeating?",
        "Feeling bad about yourself or that you are a failure?",
        "Trouble concentrating on things?",
        "Moving or speaking so slowly that other people could notice?",
        "Thoughts that you would be better off dead?",
      ],
    },
    "GAD-7": {
      title: "Generalized Anxiety Disorder-7",
      questions: [
        "Feeling nervous, anxious, or on edge?",
        "Not being able to stop or control worrying?",
        "Worrying too much about different things?",
        "Trouble relaxing?",
        "Being so restless that it's hard to sit still?",
        "Becoming easily annoyed or irritable?",
        "Feeling afraid as if something awful might happen?",
      ],
    },
    "GAD-2": {
      title: "Generalized Anxiety Disorder-2",
      questions: [
        "Feeling nervous, anxious, or on edge?",
        "Not being able to stop or control worrying?",
      ],
    },
    GHQ: {
      title: "General Health Questionnaire",
      questions: [
        "Have you recently been able to concentrate on what you’re doing?",
        "Have you recently lost much sleep over worry?",
        "Have you recently felt constantly under strain?",
        "Have you recently felt you couldn’t overcome difficulties?",
        "Have you recently been feeling unhappy and depressed?",
      ],
    },
  };

  const handleChange = (tool: string, question: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], [question]: value },
    }));
  };

  // Handle Send button click
  const handleSend = (tool: string) => {
    toaster.create({
      description: `${tool} answers submitted successfully!`,
      type: "success",
    });
  };

  // Handle PDF generation
  const handleGeneratePDF = (tool: string) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${tool} - ${screeningTools[tool].title}`, 10, 10);

    let y = 20;
    screeningTools[tool].questions.forEach((q, idx) => {
      const answer = answers[tool]?.[q] || "";
      doc.setFontSize(12);
      doc.text(`${idx + 1}. ${q}`, 10, y);
      y += 7;
      doc.text(`Answer: ${answer}`, 12, y);
      y += 10;
    });

    doc.save(`${tool}_answers.pdf`);
  };

  return (
    <Flex>
      <Card.Root
        size="lg"
        width={{ md: "30vw" }}
        mt={{ md: "1vw" }}
        ml={{ md: "1vw" }}
        letterSpacing={{ md: "-0.04vw" }}
      >
        <Card.Header>
          <Heading size="2xl">Screening Tools</Heading>
        </Card.Header>
        <Card.Body mt={{ md: "-1vw" }} color="fg.success">
          <Flex justifyContent={{ md: "flex-start" }} gap={{ md: "0.5vw" }}>
            {["PHQ-9", "GAD-7", "GAD-2", "GHQ"].map((tool) => (
              <Dialog.Root
                key={tool}
                open={activeTool === tool}
                onOpenChange={(details) =>
                  setActiveTool(details.open ? tool : null)
                }
              >
                <Dialog.Trigger asChild>
                  <Button width={{ md: "6vw" }}>{tool}</Button>
                </Dialog.Trigger>

                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content>
                      <Dialog.Header>
                        <Dialog.Title>{screeningTools[tool].title}</Dialog.Title>
                      </Dialog.Header>

                      <Dialog.Body>
                        <Flex direction="column" gap="1rem">
                          {screeningTools[tool].questions.map((q, idx) => (
                            <Flex key={idx} direction="column" gap="0.5rem">
                              <label>{q}</label>
                              <Input
                                placeholder="Type your answer here"
                                value={answers[tool]?.[q] || ""}
                                onChange={(e) =>
                                  handleChange(tool, q, e.target.value)
                                }
                              />
                            </Flex>
                          ))}
                        </Flex>
                      </Dialog.Body>

                      <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </Dialog.ActionTrigger>
                        <Button colorScheme="green" onClick={() => handleSend(tool)}>
                          Submit
                        </Button>
                        <Button
                          colorScheme="blue"
                          onClick={() => handleGeneratePDF(tool)}
                        >
                          Generate PDF
                        </Button>
                      </Dialog.Footer>

                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Dialog.CloseTrigger>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            ))}
          </Flex>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}



function Report() {
  const generatePDF = () => {
    const doc = new jsPDF();
    let finalY = 20; // track current vertical position

    // Title
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Comprehensive Patient Report", 14, finalY);
    finalY += 20;

    // Patient Demographics
    doc.setFontSize(14);
    doc.text("Patient Demographics", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Field", "Details"]],
      body: [
        ["Name", "Abhishek Tiwari"],
        ["Email", "abhishek@gmail.com"],
        ["Phone", "9049122622"],
        ["Gender", "Male"],
        ["Age", "28"],
        ["Date of Birth", "1997-03-15"],
      ],
    });
    finalY = (doc as any).lastAutoTable.finalY + 15;

    // Clinical Information
    if (finalY > 250) doc.addPage(), (finalY = 20);
    doc.text("Clinical Information", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Category", "Details"]],
      body: [
        ["Diagnosis", "Mild Depression, Generalized Anxiety Disorder"],
        ["Medications", "Sertraline 50mg daily, Vitamin D3 supplement"],
        ["Allergies", "None reported"],
        ["Past Conditions", "Childhood asthma (resolved)"],
        ["Lifestyle Notes", "Sedentary, irregular sleep patterns"],
      ],
    });
    finalY = (doc as any).lastAutoTable.finalY + 15;

    // Screening Tools
    if (finalY > 250) doc.addPage(), (finalY = 20);
    doc.text("Screening Tools Results", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Tool", "Score", "Interpretation"]],
      body: [
        ["PHQ-9", "12", "Moderate depression"],
        ["GAD-7", "10", "Moderate anxiety"],
        ["GAD-2", "4", "At risk"],
        ["GHQ", "15", "Possible psychological distress"],
      ],
    });
    finalY = (doc as any).lastAutoTable.finalY + 15;

    // Analysis Summary
    if (finalY > 250) doc.addPage(), (finalY = 20);
    doc.text("Analysis Summary (Last 4 Months)", 14, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Month", "PHQ-9", "GAD-7", "Stress"]],
      body: [
        ["May", "5", "4", "5"],
        ["June", "6", "5", "6"],
        ["July", "4", "6", "5"],
        ["August", "5", "4", "4"],
      ],
    });
    finalY = (doc as any).lastAutoTable.finalY + 15;

    // Recommendations
    if (finalY > 230) doc.addPage(), (finalY = 20);
    doc.text("Recommendations", 14, finalY);
    doc.setFontSize(12);
    const rec = [
      "1. Continue current medication and monitor for side effects.",
      "2. Engage in daily physical exercise (20-30 minutes).",
      "3. Practice breathing exercises and mindfulness meditation.",
      "4. Regular sleep schedule (min 7 hrs/night).",
      "5. Follow-up appointment in 4 weeks.",
    ];
    let y = finalY + 10;
    rec.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 8;
    });
    finalY = y + 10;

    // Helpline
    if (finalY > 250) doc.addPage(), (finalY = 20);
    doc.setFontSize(14);
    doc.text("Emergency Helpline", 14, finalY);
    doc.setFontSize(12);
    doc.text("24/7 Support: 1800 891 4416", 20, finalY + 8);
    finalY += 25;

    // Doctor’s Signature
    if (finalY > 240) doc.addPage(), (finalY = 20);
    doc.setFontSize(14);
    doc.text("Reviewed By:", 14, finalY);
    doc.text("Dr. Adarsh (MD, Psychiatry)", 20, finalY + 10);
    doc.text("Signature: ____________________", 20, finalY + 20);

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Generated by Mental Health Dashboard • Confidential Report • Page ${i} of ${pageCount}`,
        14,
        290
      );
    }

    doc.save("patient_report.pdf");
  };

  return (
    <Flex>
      <Card.Root
        size="lg"
        width={{ md: "30vw" }}
        mt={{ md: "1vw" }}
        ml={{ md: "1vw" }}
        letterSpacing={{ md: "-0.04vw" }}
      >
        <Card.Header>
          <Heading size="2xl">Report Generation</Heading>
        </Card.Header>
        <Card.Body mt={{ md: "-1vw" }} color="fg.success">
          <Flex justifyContent={{ md: "flex-start" }} gap={{ md: "0.5vw" }}>
            <Button
              letterSpacing={{ md: "0vw" }}
              variant={"plain"}
              width={"full"}
              backgroundColor={"green.500"}
              _hover={{ backgroundColor: "green.400" }}
              onClick={generatePDF}
            >
              Generate Report
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}


const MotionBox = motion(Box);


function BreathingExerciseCard() {
  const [isExercising, setIsExercising] = useState(false);
  const [fill, setFill] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = fill, -1 = empty

  useEffect(() => {
    let interval: number;
    if (isExercising) {
      interval = window.setInterval(() => {
        setFill((prev) => {
          let next = prev + direction * 2; // 2% per 100ms → 5s full cycle
          if (next >= 100) {
            next = 100;
            setDirection(-1);
          } else if (next <= 0) {
            next = 0;
            setDirection(1);
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isExercising, direction]);

  return (
    <Card.Root
      size="lg"
      width={{ md: "33vw" }}
      mt={{ md: "1vw" }}
      ml={{ md: "1vw" }}
      letterSpacing={{ md: "-0.04vw" }}
    >
      <Card.Header>
        <Heading size="2xl">Breathing Exercise</Heading>
      </Card.Header>
      <Card.Body color="fg.muted" mt={{ md: "-1vw" }} fontSize={{ md: "1.2vw" }}>
        <Box mb={4} textAlign="center" fontWeight="900">
          {isExercising ? (direction === 1 ? "Inhale" : "Exhale") : "Press Start"}
        </Box>
        <Box width="100%" height="20px" bg="gray.300" borderRadius="md" overflow="hidden">
          <MotionBox
            width={`${fill}%`}
            height="100%"
            bg={direction === 1 ? "blue.400" : "green.400"}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </Box>
        <Button
          mt={4}
          colorScheme={isExercising ? "red" : "blue"}
          w="full"
          onClick={() => setIsExercising(!isExercising)}
        >
          {isExercising ? "Stop Exercise" : "Start Exercise"}
        </Button>
      </Card.Body>
    </Card.Root>
  );
}

function Analysis() {
    const chart = useChart({
    data: [
        { PHQ9: 5, GAD7: 6, stress: 4, month: "January" },
        { PHQ9: 6, GAD7: 5, stress: 5, month: "February" },
        { PHQ9: 4, GAD7: 7, stress: 6, month: "March" },
        { PHQ9: 7, GAD7: 6, stress: 7, month: "April" },
        { PHQ9: 5, GAD7: 4, stress: 5, month: "May" },
        { PHQ9: 6, GAD7: 5, stress: 6, month: "June" },
        { PHQ9: 4, GAD7: 6, stress: 5, month: "July" },
        { PHQ9: 5, GAD7: 4, stress: 4, month: "August" },
    ],
    series: [
        { name: "PHQ9", color: "red.400" },   // Depression score
        { name: "GAD7", color: "orange.400" }, // Anxiety score
        { name: "stress", color: "blue.400" }, // Stress level
    ],
    });
  return (
    <Card.Root size="lg" width={{md: "65vw"}} height={{md: "29.3vw"}} mt={{md: "1vw"}} ml={{md: "1vw"}} letterSpacing={{md: "-0.04vw"}}>
        <Card.Header textAlign={{md: "left"}}>
            <Heading size="2xl"><a href="https://chords.upsidedownlabs.tech/stream" >EEG Analysis</a></Heading>
            </Card.Header>
        <Chart.Root height={"24vw"} chart={chart} p={{md: "1vw"}}>
        <AreaChart data={chart.data}>
            <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
            <XAxis
            axisLine={false}
            tickLine={false}
            dataKey={chart.key("month")}
            tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip
            cursor={false}
            animationDuration={100}
            content={<Chart.Tooltip />}
            />
            <Legend content={<Chart.Legend />} />
            {chart.series.map((item) => (
            <Area
                key={item.name}
                isAnimationActive={false}
                dataKey={chart.key(item.name)}
                fill={chart.color(item.color)}
                fillOpacity={0.2}
                stroke={chart.color(item.color)}
                stackId="a"
            />
            ))}
        </AreaChart>
        </Chart.Root>
    </Card.Root>
  )
}


function Info() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const vapiInstance = new Vapi("0379162b-7353-45ed-9aa6-344b984aae27");
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnected(true);
      setIsLoading(false);
    });

    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsLoading(false);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const startCall = async () => {
    if (!vapi) return;
    setIsLoading(true);
    await vapi.start("905fdf53-1ad4-490d-8ecc-fe48ddf4f8d3");
  };

  const endCall = async () => {
    await vapi?.stop();
    setIsConnected(false);
    setIsLoading(false);
  };

  return (
    <Flex>
      <Card.Root
        size="lg"
        width={{ md: "31vw" }}
        pt={{ md: "1vw" }}
        mt={{ md: "1vw" }}
        ml={{ md: "1vw" }}
        letterSpacing={{ md: "-0.04vw" }}
      >
        <Card.Body color="fg.muted" mt={{ md: "-1vw" }} fontSize={{ md: "1.2vw" }}>
          <Flex justifyContent={{ md: "space-between" }}>
            <Text fontSize={"2vw"} fontWeight={{ md: "200" }}>
              Hello, Abhishekh.
            </Text>
            <Avatar.Root colorPalette="blue">
              <Avatar.Fallback name="Random" />
              <Avatar.Image src="./image.png" />
            </Avatar.Root>
          </Flex>

          {/* AI Button */}
          <Flex>
            <Button
              variant="solid"
              width="25vw"
              p="3vw"
              mt="3vw"
              bg={
                isConnected
                  ? "green.500"
                  : isLoading
                  ? "orange.400"
                  : "gray.600"
              }
              _hover={{
                bg: isConnected
                  ? "green.400"
                  : isLoading
                  ? "orange.300"
                  : "gray.500",
              }}
              onClick={isConnected ? endCall : startCall}
            >
              <Flex justifyContent="space-between" gap="3vw" width="100%">
                <Text mt="0.9vw" fontSize="1.2vw" color="white" fontWeight="300">
                  {isConnected
                    ? "Talking to Adarsh"
                    : isLoading
                    ? "Loading AI..."
                    : "Talk with AI"}
                </Text>

                <AvatarGroup gap="0" spaceX="-3" size="lg">
                  <Avatar.Root>
                    <Avatar.Fallback name="Uchiha Sasuke" />
                    <Avatar.Image src="https://cdn.myanimelist.net/r/84x124/images/characters/9/131317.webp?s=d4b03c7291407bde303bc0758047f6bd" />
                  </Avatar.Root>

                  <Avatar.Root>
                    <Avatar.Fallback name="Baki Ani" />
                    <Avatar.Image src="https://cdn.myanimelist.net/r/84x124/images/characters/7/284129.webp?s=a8998bf668767de58b33740886ca571c" />
                  </Avatar.Root>

                  <Avatar.Root>
                    <Avatar.Fallback name="Uchiha Chan" />
                    <Avatar.Image src="https://cdn.myanimelist.net/r/84x124/images/characters/9/105421.webp?s=269ff1b2bb9abe3ac1bc443d3a76e863" />
                  </Avatar.Root>

                  <Avatar.Root variant="solid">
                    <Avatar.Fallback>+3</Avatar.Fallback>
                  </Avatar.Root>
                </AvatarGroup>
              </Flex>
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}
export default Dashboard;