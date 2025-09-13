import { Card, Flex, Heading, Text } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react"
import  { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Chart, useChart } from "@chakra-ui/charts"
import { Avatar, defineStyle } from "@chakra-ui/react"
import { AvatarGroup } from "@chakra-ui/react"

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

function Tools() {
    return(
        <Flex>
        <Card.Root size="lg" width={{md: "30vw"}} mt={{md: "1vw"}} ml={{md: "1vw"}} letterSpacing={{md: "-0.04vw"}}>
            <Card.Header>
            <Heading size="2xl">Screening Tools</Heading>
            </Card.Header>
            <Card.Body mt={{md: "-1vw"}} color="fg.success">
                <Flex justifyContent={{md: "flex-start"}} gap={{md: "0.5vw"}}>
                    <Button width={{md: "6vw"}}>PHQ-9</Button>
                    <Button width={{md: "6vw"}}>GAD-7</Button>
                    <Button width={{md: "6vw"}}>GAD-2</Button>
                    <Button width={{md: "6vw"}}>GHQ</Button>
                </Flex>
            </Card.Body>
        </Card.Root>
        </Flex> 
    )
}

function Report() {
    return(
        <Flex>
        <Card.Root size="lg" width={{md: "30vw"}} mt={{md: "1vw"}} ml={{md: "1vw"}} letterSpacing={{md: "-0.04vw"}}>
            <Card.Header>
            <Heading size="2xl">Report Generation</Heading>
            </Card.Header>
            <Card.Body mt={{md: "-1vw"}} color="fg.success">
                <Flex justifyContent={{md: "flex-start"}} gap={{md: "0.5vw"}}>
                    <Button letterSpacing={{md: "0vw"}} variant={"plain"} width={"full"} backgroundColor={"green.500"} _hover={{backgroundColor: "green.400"}}>Generate Report</Button>
                </Flex>
            </Card.Body>
        </Card.Root>
        </Flex> 
    )
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

const ringCss = defineStyle({
  outlineWidth: "3px",
  outlineColor: "colorPalette.500",
  outlineOffset: "2px",
  outlineStyle: "dotted",
})

function Info() {
    return(
        <Flex>
        <Card.Root size="lg" width={{md: "31vw"}} pt={{md: "1vw"}} mt={{md: "1vw"}} ml={{md: "1vw"}} letterSpacing={{md: "-0.04vw"}}>
            <Card.Body color="fg.muted" mt={{md: "-1vw"}} fontSize={{md: "1.2vw"}}>
                <Flex justifyContent={{md: "space-between"}}>
                    <Text fontSize={"2vw"} fontWeight={{md: "200"}}>Hello, Abhishekh.</Text>
                    <Avatar.Root css={ringCss} colorPalette="blue">
                        <Avatar.Fallback name="Random" />
                        <Avatar.Image src="./image.png" />
                    </Avatar.Root>
                </Flex>
                <Flex>
                  <Button variant={"solid"} width={"25vw"} p={"3vw"} mt={"3vw"} backgroundColor={"gray.600"} _hover={{backgroundColor: "gray.500"}}>
                    <Flex justifyContent={"space-between"} gap={"3vw"}>
                      <Text mt={"0.9vw"} fontSize={"1.2vw"} color={"white"} fontWeight={"300"}><a href="https://elevenlabs.io/app/talk-to?agent_id=agent_8101k50wyt85f0d8qp99ntvzmxnq">Talk with AI</a></Text>
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
    )
}

function Info2() {
  useEffect(() => {
    // Load ElevenLabs script dynamically
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Flex mt="2vw" justify="center">
      <elevenlabs-convai agent-id="agent_8101k50wyt85f0d8qp99ntvzmxnq"></elevenlabs-convai>
    </Flex>
  );
}

export default Dashboard;