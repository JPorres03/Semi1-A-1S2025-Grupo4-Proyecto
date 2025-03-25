import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// 52.15.187.97:3001 -> Python
// 3.135.206.218:3001 -> Node.js
// http://loadbalancer-semi1-a-g4-2060108214.us-east-2.elb.amazonaws.com:80 -> Load Balancer
// http://ebookvault-semi1-a-g4.s3-website-us-east-1.amazonaws.com/ -> S3 Bucket
export const endpoint = "http://loadbalancer-semi1-a-g4-2060108214.us-east-2.elb.amazonaws.com:80";