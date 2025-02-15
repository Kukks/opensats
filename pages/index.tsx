import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ProjectList from '../components/ProjectList'
import PaymentModal from '../components/PaymentModal'
import Link from 'next/link'
import Image from 'next/image'
import unicorn from '/public/heroes/unicorn.png'
import { getAllPosts, getPostBySlug } from '../utils/md'
import Credits from '../components/Credits'
import { ProjectItem } from '../utils/types'
import { useRouter } from 'next/router'

const Home: NextPage<{ projects: ProjectItem[], generalFund: ProjectItem, opsFund: ProjectItem }> = ({ projects, generalFund, opsFund }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const router = useRouter()

  const [selectedProject, setSelectedProject] = useState<ProjectItem>()

  function closeModal() {
    setModalOpen(false)
  }

  function openPaymentModal(project: ProjectItem) {
    setSelectedProject(project)
    setModalOpen(true)
  }

  function openGeneralFundModal() {
    openPaymentModal(generalFund)
  }

  function openopsFundModal() {
    openPaymentModal(opsFund)
  }
  
  useEffect(() => {
    if (router.isReady) {
      console.log(router.query);
      if (router.query.donate === "ops") {
        openPaymentModal(opsFund)
      }

    }
  }, [router.isReady])

  return (
    <>
      <Head>
        <title>OpenSats</title>
        <meta name="description" content="TKTK" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="flex py-8 items-center">
          <div className="p-4 md:p-8 space-y-8 basis-2/3 max-w-4xl">
            <h1>
              Support contributors to Bitcoin and other free and open source
              projects
            </h1>
            <p className="text-textgray">
              We help you find and support open-source Bitcoin projects -
              helping create a better tomorrow, today.
            </p>
            <button role={'button'} onClick={openGeneralFundModal}>
              Donate to General Fund
            </button> {'                        '}
            <button role={'button'} onClick={openopsFundModal}>
              Donate to Operations Budget
            </button>
            <p>  
              Are you an open source contributor?{' '}
              <Link href="/apply">
                <a>Apply for your project to be listed.</a>
              </Link>
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <Image width={388} height={388} src={unicorn} alt="Unicorn" />
          </div>
        </section>
        <ProjectList projects={projects} openPaymentModal={openPaymentModal} />
        <Credits />
      </main>
      <PaymentModal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        project={selectedProject}
      />
    </>
  )
}

export default Home

export async function getStaticProps({ params }: { params: any }) {
  const projects = getAllPosts()

  const generalFund = getPostBySlug("general_fund", true);
  const opsFund = getPostBySlug("operations_budget", true);

  return {
    props: {
      projects,
      generalFund,
      opsFund
    },
  }
}
