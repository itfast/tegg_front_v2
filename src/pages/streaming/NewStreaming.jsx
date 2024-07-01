import { Tooltip } from "react-tooltip";
import {
  Button,
  ContainerMobile,
  ContainerWeb,
  PageLayout,
} from "../../../globalStyles";
import { CardData, CardData2, CardLogo } from "./NewStreaming.styles";
// import { RiInformation2Fill } from "react-icons/ri";
import { GrCircleInformation } from "react-icons/gr";
import { TiDeleteOutline } from "react-icons/ti";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import { Pgto } from "./Pgto";
import api from "../../services/api";
import { SubscriptionInfoTv } from "../subscriptions/SubscriptionInfoTv";
import { TableItens } from "../orders/clientNew/NewOrder.styles";
import { SubscriptionInfoMobileTv } from "../subscriptions/SubscriptionInfoMobileTv";
import moment from "moment";
import { PageTitles } from '../../components/PageTitle/PageTitle'

export const NewStreaming = () => {
  const imgDeezer = 'url("/assets/tv/deezer/Copy of Vertical-cb-rgb.svg")';
  const imgCurta =
    'url("/assets/tv/curtaOn/_Logo_Horizontal_Black_slogan_clubededocumentarios.png")';
  const imgDocway = 'url("/assets/tv/docWay/_logopositivo.png")';
  const imgHotGo = 'url("/assets/tv/hotgo/HOT GO VERMELHO E CINZA.png")';
  const imgRitualFit = 'url("/assets/tv/ritualFit/Ritual Fit.jpg")';
  const imgSmartContent = 'url("/assets/tv/smartContent/logo-sc_vermelho.png")';
  const imgHbo =
    'url("/assets/tv/HBO/Title_MasterImage_1024x1024_languageCode.png")';
  const imgQueimaDiaria =
    'url("/assets/tv/queimaDiaria/qd-logo-redesign-01.png")';

  //   const imgCiencias =
  //     'url("/assets/tv/Standard/clubCiencias/image-2022-08-29-11-35-53-109.png")';
  const imgCiencias = 'url("/assets/tv/Standard/clubCiencias/ClubLogo.png")';
  // const imgCiencias = 'url("/assets/tv/Standard/clubCiencias/Logo_140x80 (1).png")'
  // const imgCiencias = 'url("/assets/tv/Standard/clubCiencias/logo-club-ciencias-400x400.png")'
  // const imgCiencias = 'url("/assets/tv/Standard/clubCiencias/Logo-vetor-Club-Ciencias.png")'

  const imgFluid = 'url("/assets/tv/Standard/fluid/logo_fluid_bg.png")';
  const imgFuze =
    'url("/assets/tv/Standard/fuze/logo-fuzeforge-horizontal.png")';
  const imgGalinha = 'url("/assets/tv/Standard/galinha/Logo_GP-novo3.png")';
  const imgRevistas =
    'url("/assets/tv/Standard/revistas/hube-revistas-icone.png")';
  const imgVantagens =
    'url("/assets/tv/Standard/vantagens/logo_hub_vantagens_vertical.png")';
  //   const imgKaspersky =
  //     'url("/assets/tv/Standard/kaspersky/Kaspersky logo white on green.png_EE25B125.png")';
  const imgKaspersky3 = 'url("/assets/tv/Standard/kaspersky/kaspersky3.png")';
  const imgKaspersky5 = 'url("/assets/tv/Standard/kaspersky/kaspersky5.png")';
  const imgLooke = 'url("/assets/tv/Standard/looke/looke.webp")';
  const imgMaia =
    'url("/assets/tv/Standard/maia/maia_logo_Versao1_Horizontal.svg")';
  const imgPocoyo = 'url("/assets/tv/Standard/pocoyo/Pocoyo.png")';
  const imgQnutri =
    'url("/assets/tv/Standard/qnutri/Logo Q Nutri_Prancheta 1.png")';
  const imgTapLingo = 'url("/assets/tv/Standard/tapLingo/top-lingo.png")';
  const imgUbook = 'url("/assets/tv/Standard/ubook/ubook1.png")';

  const imgSocialComics =
    'url("/assets/tv/Standard/socialComics/socialComics.png")';
  const imgUbookNews = 'url("/assets/tv/Standard/ubookNews/bookNews.png")';
  const imgPlaykids = 'url("/assets/tv/Standard/playKids/playKids.png")';
  const imgToaqui = 'url("/assets/tv/Standard/toAqui/toAqui.png")';
  const imgReforca = 'url("/assets/tv/Standard/reforca/reforca.png")';

  const [modal, setModal] = useState(false);
  const [modalInform, setModalInform] = useState(false);
  const [info, setInfo] = useState();
  const [selecteds, setSelecteds] = useState([]);
  const [tvsubscriptions, setTvSubscriptions] = useState([]);
  const [qtdStandard, setQtdStandard] = useState(0);
  const [qtdPremium, setQtdPremium] = useState(0);
  const [hasStandard, setHasStandard] = useState(0);
  const [hasPremium, setHasPremium] = useState(0);
  const [modalContract, setModalContract] = useState(false);
  const [email, setEmail] = useState();
  const [edit, setEdit] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const standardOpt = [
    {
      idx: 0,
      title: "Clube de ciências",
      img: imgCiencias,
      description:
        "No Clube Ciências, você aprende e desenvolve suas habilidades em diferentes áreas do conhecimento de forma interativa e divertida!",
    },
    {
      idx: 1,
      title: "Fuid",
      img: imgFluid,
      description: "Práticas de meditação e yoga com Fluid.",
    },
    {
      idx: 3,
      title: "Fuze Forge",
      img: imgFuze,
      description:
        "Divirta-se com conteúdos exclusivos sobre as principais ligas!",
    },
    {
      idx: 4,
      title: "Galinha pintadinha",
      img: imgGalinha,
      description: "Crescendo com a Galinha Pintadinha.",
    },
    {
      idx: 5,
      title: "Hub revistas",
      img: imgRevistas,
      description:
        "Mais de 200 títulos das maiores revistas e notícias com o hube.",
    },
    {
      idx: 6,
      title: "Hub vantagem",
      img: imgVantagens,
      description:
        "Enquanto seus clientes aproveitam descontos e cashbacks com o Clube de Vantagens, a sua empresa cria conexões reais com eles. São mais de 3 mil marcas e 25 mil estabelecimentos.",
    },
    {
      idx: 7,
      title: "Looke",
      img: imgLooke,
      description:
        "O Looke é uma plataforma de streaming completa que oferece acesso ilimitados a filmes, séries, conteúdo infantil, conteúdos originais e exclusivos.",
    },
    {
      idx: 8,
      title: "Maia",
      img: imgMaia,
      description:
        "Nunca foi tão fácil ter uma assistente virtual, a Maia te auxiliará em várias atividades do seu dia-a-dia.",
    },
    {
      idx: 9,
      title: "Pocoyo house",
      img: imgPocoyo,
      description: "Toda a diversão e entretenimento com Pocoyo.",
    },
    {
      idx: 10,
      title: "+QNutri",
      img: imgQnutri,
      description:
        "O +Q Nutri é mais um produto incrível da Queima Diária para você! Com ele você aprende o que comer, quando comer e como evitar determinados alimentos! Tudo isso sem dietas da moda ou restritivas!",
    },
    {
      idx: 11,
      title: "Tap Lingo",
      img: imgTapLingo,
      description:
        "O app de idiomas mais fácil que existe. Flashcards para memorizar e aprender a pronúncia correta.",
    },
    {
      idx: 12,
      title: "Ubook",
      img: imgUbook,
      description:
        "Tenha acesso a mais de 100 mil títulos, entre audiobooks, ebooks, podcasts, séries, documentários e notícias com o Ubook.",
    },
    {
      idx: 13,
      title: "CurtaOn",
      img: imgCurta,
      description:
        "Centenas de filmes e episódios de séries documentais, organizadas por temas de interesse.",
    },
    {
      idx: 14,
      title: "Kaspersky Standard - 3 Lic.",
      img: imgKaspersky3,
      description:
        "Kaspersky Internet Security, a maior proteção e detecção de ameaças em tempo real, além de proteção completa para sua privacidade e identidade on-line. Licenças que podem ser utilizadas em até 3 dispositivos e tais licenças podem ser compartilhadas por e-mail.",
    },
    {
      idx: 15,
      title: "Deezer",
      img: imgDeezer,
      description:
        "A Deezer é uma plataforma de streaming musical, que disponibiliza um catálogo musical diversificado de todo o mundo.",
    },
    {
      idx: 16,
      title: "Social comincs",
      img: imgSocialComics,
      description:
        "A Social Comics é a maior plataforma de leitura em quadrinhos da América Latina. Títulos como Star Wars, Turma da Mônica e mais de 20 outros grandes sucessos estão disponíveis na plataforma.",
    },
    {
      idx: 17,
      title: "Ubook news",
      img: imgUbookNews,
      description:
        "Mantenha-se informado o tempo inteiro sobre o que acontece no Brasil e no mundo com a Ubook News",
    },
    {
      idx: 18,
      title: "Playkids",
      img: imgPlaykids,
      description:
        "Ofereça diversão, aprendizado e muito conteúdo para o seu filho com o melhor conteúdo infantil.",
    },
    {
      idx: 19,
      title: "To Aqui",
      img: imgToaqui,
      description:
        "Um localizador e com apenas um clique, é possível acessar o mapa e ver onde estão as pessoas que mais importam para você.",
    },
    {
      idx: 20,
      title: "Reforça",
      img: imgReforca,
      description:
        "Um app com cards que tiram as dúvidas das principais matérias de forma simples e divertida.",
    },
  ];
  const premiumOpt = [
    {
      idx: 0,
      title: "Kaspersky Plus - 5 Lic.",
      img: imgKaspersky5,
      description:
        "KTS – Kaspersky Total Security oferece proteção de ameaças online e garante segurança e privacidade para tudo que for feito de forma online. Oferece licenças que podem ser utilizadas em até 5 dispositivos e podem ser compartilhadas por e-mail.",
    },
    {
      idx: 1,
      title: "DocWay",
      img: imgDocway,
      description:
        "A Docway é uma plataforma de telemedicina, que permite que você cuide da sua saúde com conforto e segurança, sem sair de casa.",
    },
    {
      idx: 3,
      title: "HotGo",
      img: imgHotGo,
      description:
        "As melhores marcas de entretenimento adulto, em um só lugar.",
    },
    {
      idx: 4,
      title: "Ritual Fit",
      img: imgRitualFit,
      description: "O aplicativo de treinamento pessoal para pessoas fitness",
    },
    {
      idx: 5,
      title: "Smart Content",
      img: imgSmartContent,
      description: "Seu Lifelong Learning a qualquer hora e em qualquer lugar!",
    },
    {
      idx: 6,
      title: "MAX",
      img: imgHbo,
      description:
        "Assista a séries icônicas, filmes premiados, produções originais e muito mais na Max.",
    },
    {
      idx: 7,
      title: "Queima diária",
      img: imgQueimaDiaria,
      description:
        "TRANSFORME O SEU CORPO E A SUA VIDA! A Queima Diária é uma plataforma com programas de exercícios para fazer em casa.",
    },
  ];
  const [inStandardBank, setStandardInBank] = useState(0);
  const [inPremiumBank, setInPremiumBank] = useState(0);

  const getTvSubscriptions = () => {
    console.log("buscar");
    api.streaming
      .getAll("")
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          if (res?.data?.PlayHubSubscriptions?.length > 0) {
            setTvSubscriptions([res.data]);
            let premium = 0;
            let standard = 0;

            res?.data?.PlayHubSubscriptions?.forEach((p) => {
              const has = p.PlayHubId?.includes("P");
              if (has) {
                premium += Number(
                  p.PlayHubId?.substring(1, p.PlayHubId?.lenght)
                );
              } else {
                standard += Number(
                  p.PlayHubId?.substring(1, p.PlayHubId?.lenght)
                );
              }
            });
            setStandardInBank(standard);
            setInPremiumBank(premium);
            setQtdStandard(standard);
            setQtdPremium(premium);
            setHasStandard(standard);
            setHasPremium(premium);
            // console.log(premium, standard)
          }
        }
        setLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTvSubscriptions();
    if (api.currentUser) {
      setEmail(api.currentUser.Email);
    }
  }, []);

  const changeModal = () => {
    console.log('buscar...')
    setTvSubscriptions([]);
    setLoaded(false);
    setModalContract(false);
    getTvSubscriptions();
    setEdit(false);
  };

  const handleSelect = (item) => {
    // const has = selecteds.find((s) => s.img === item.img);
    // if (!has) {
    if (item.type === "Standard") {
      if (qtdStandard < 10) {
        // const orig = _.cloneDeep(standardOpt);
        setSelecteds([...selecteds, item]);
        setQtdStandard(qtdStandard + 1);
        // orig.splice(item.idx, 1);
        // setStandardOpt(orig);
      } else {
        toast.error("A quantidade máxima da área Standard já foi atingida");
      }
    } else {
      if (qtdPremium < 5) {
        // const orig = _.cloneDeep(premiumOpt);
        setSelecteds([...selecteds, item]);
        setQtdPremium(qtdPremium + 1);
        // orig.splice(item.idx, 1);
        // setPremiumOpt(orig);
      } else {
        toast.error("A quantidade máxima da área Premium já foi atingida");
      }
    }
    // } else {
    //   toast.error("Produto já selecionado");
    // }
  };

  const handleDelete = (type) => {
    const orig = _.cloneDeep(selecteds);
    // const type = orig[idx].type;
    if (type === "Standard") {
      const find = orig.findIndex((o) => o.type === type);
      console.log(find);
      orig.splice(find, 1);
      setQtdStandard(qtdStandard - 1);
    } else {
      const find = orig.findIndex((o) => o.type === type);
      console.log(find);
      orig.splice(find, 1);
      setQtdPremium(qtdPremium - 1);
    }

    setSelecteds(orig);
  };

  const getDate = (product) => {
    let myDate = "";
    tvsubscriptions[0]?.PlayHubSubscriptions?.forEach((p) => {
      const has = p.PlayHubId?.includes(product);
      if (has) {
        myDate = moment(p?.EndDate).format("DD/MM/YYYY");
      } else {
        return "";
      }
    });
    return myDate;
  };

  return (
    <>
      <PageLayout>
        <Tooltip id="stream-tooltip" />
        <PageTitles title="Tegg TV" />
        {loaded && (
          <>
            {tvsubscriptions.length > 0 && !edit ? (
              <>
                <ContainerWeb>
                  <TableItens style={{ marginTop: "1rem" }}>
                    <thead>
                      <tr>
                        <th>Login</th>
                        <th>Link de acesso</th>
                        <th>Produtos</th>
                        <th>Primeira senha</th>
                        <th>Pagamento recorrente</th>
                        <th>Data Ativação</th>
                        <th>Expira em</th>
                        {/* <th>Vencimento da próxima fatura</th>
                      <th>Ações</th> */}
                      </tr>
                    </thead>
                    {tvsubscriptions.map((subcription, index) => (
                      <SubscriptionInfoTv
                        key={index}
                        subscription={subcription}
                        getSubscriptions={() => console.log()}
                        pageNum={1}
                        pageSize={10}
                        setEdit={setEdit}
                        changeModal={changeModal}
                      />
                    ))}
                  </TableItens>
                </ContainerWeb>
                <ContainerMobile>
                  {tvsubscriptions.map((n) => (
                    <SubscriptionInfoMobileTv
                      key={n.Id}
                      n={n}
                      planOpt={[]}
                      reload={() => console.log("nada")}
                      setEdit={setEdit}
                      changeModal={changeModal}
                    />
                  ))}
                </ContainerMobile>
              </>
            ) : (
              <>
                <h4>
                  Escolha até {10 - qtdStandard} produtos da área Standard e até{" "}
                  {5 - qtdPremium} da área Premium
                </h4>
                <br />
                <ContainerWeb style={{ flexDirection: "column" }}>
                  <CardData style={{ maxWidth: 2000, width: "100%" }}>
                    <h4 className="title">Meus selecionados</h4>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          marginTop: "1rem",
                          flexWrap: "wrap",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid #000",
                            padding: "0.5rem",
                            justifyContent: "center",
                            borderRadius: "4px",
                          }}
                        >
                          {qtdStandard > 0 ? (
                            <TiDeleteOutline
                              style={{ marginLeft: 110, cursor: "pointer" }}
                              size={20}
                              color="red"
                              onClick={() =>
                                qtdStandard > 0 && handleDelete("Standard")
                              }
                            />
                          ) : (
                            <div style={{ marginLeft: 130 }}></div>
                          )}
                          <div>STANDARD</div>
                          <h1 style={{ fontSize: "3.5rem" }}>{qtdStandard}</h1>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid #000",
                            padding: "0.5rem",
                            justifyContent: "center",
                            borderRadius: "4px",
                          }}
                        >
                          {qtdPremium > 0 ? (
                            <TiDeleteOutline
                              style={{ marginLeft: 110, cursor: "pointer" }}
                              size={20}
                              color="red"
                              onClick={() =>
                                qtdPremium > 0 && handleDelete("Premium")
                              }
                            />
                          ) : (
                            <div style={{ marginLeft: 130 }}></div>
                          )}
                          <div>PREMIUM</div>
                          <h1 style={{ fontSize: "3.5rem" }}>{qtdPremium}</h1>
                        </div>
                      </div>
                      <div style={{ margin: "1rem" }}>
                        <h2
                          style={{
                            //   color: "white",
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                        >
                          R$
                          <span
                            style={{ fontSize: "3.5rem", marginTop: "-0.5rem" }}
                          >
                            {((qtdPremium + qtdStandard) * 49.9).toFixed(2)}
                            {/* {(selecteds.length * 49.9).toFixed(2)} */}
                          </span>
                        </h2>
                        <Button
                          style={{ width: "100%" }}
                          onClick={() => {
                            if (qtdPremium + qtdStandard > 0) {
                              if (inPremiumBank > 0 && inStandardBank > 0) {
                                if (
                                  qtdPremium < inPremiumBank ||
                                  qtdStandard < inStandardBank
                                ) {
                                  setModalInform(true);
                                } else {
                                  setModalContract(true);
                                }
                              } else {
                                setModalContract(true);
                              }
                            } else {
                              toast.error("Selecione pelo menos um produto");
                            }
                          }}
                        >
                          {edit ? "CONFIRMAR ALTERAÇÃO" : "CONTRATAR"}
                        </Button>
                      </div>
                    </div>
                  </CardData>
                  <br />
                  <div style={{ display: "flex", gap: 10 }}>
                    <CardData2 style={{ width: "50%" }}>
                      <h4 className="title">STANDARD</h4>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          marginTop: "1rem",
                          flexWrap: "wrap",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {standardOpt.map((s, idx) => (
                          <div key={idx} style={{ textAlign: "center" }}>
                            <CardLogo
                              style={{
                                minWidth: 142,
                                minHeight: 142,
                                backgroundImage: s.img,
                              }}
                              onClick={() =>
                                handleSelect({
                                  ...s,
                                  type: "Standard",
                                  idx: idx,
                                })
                              }
                            />
                            <h5>
                              {s.title}
                              <GrCircleInformation
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setInfo({
                                    title: s.title,
                                    text: s.description,
                                  });
                                  setModal(true);
                                }}
                              />
                            </h5>
                          </div>
                        ))}
                      </div>
                    </CardData2>
                    <CardData2 style={{ width: "50%" }}>
                      <h4 className="title">PREMIUM</h4>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          marginTop: "1rem",
                          flexWrap: "wrap",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {premiumOpt.map((p, idx) => (
                          <div key={idx} style={{ textAlign: "center" }}>
                            <CardLogo
                              style={{
                                minWidth: 142,
                                minHeight: 142,
                                backgroundImage: p.img,
                              }}
                              onClick={() =>
                                handleSelect({
                                  ...p,
                                  type: "Premium",
                                  idx: idx,
                                })
                              }
                            />
                            <h5>
                              {p.title}
                              <GrCircleInformation
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setInfo({
                                    title: p.title,
                                    text: p.description,
                                  });
                                  setModal(true);
                                }}
                              />
                            </h5>
                          </div>
                        ))}
                      </div>
                    </CardData2>
                  </div>
                </ContainerWeb>
                <ContainerMobile style={{ width: "100%", height: 0 }}>
                  <CardData style={{ width: "100%" }}>
                    <h4 className="title" style={{ fontWeight: "bold" }}>
                      Meus selecionados
                    </h4>

                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          marginTop: "1rem",
                          flexWrap: "wrap",
                          justifyContent: "space-evenly",
                          maxHeight: 400,
                          overflowY: "scroll",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid #000",
                            padding: "0.5rem",
                            justifyContent: "center",
                            borderRadius: "4px",
                          }}
                        >
                          {qtdStandard > 0 ? (
                            <TiDeleteOutline
                              style={{ marginLeft: 110, cursor: "pointer" }}
                              size={20}
                              color="red"
                              onClick={() =>
                                qtdStandard > 0 && handleDelete("Standard")
                              }
                            />
                          ) : (
                            <div style={{ marginLeft: 130 }}></div>
                          )}
                          <div>STANDARD</div>
                          <h1 style={{ fontSize: "3.5rem" }}>{qtdStandard}</h1>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid #000",
                            padding: "0.5rem",
                            justifyContent: "center",
                            borderRadius: "4px",
                          }}
                        >
                          {qtdPremium > 0 ? (
                            <TiDeleteOutline
                              style={{ marginLeft: 110, cursor: "pointer" }}
                              size={20}
                              color="red"
                              onClick={() =>
                                qtdPremium > 0 && handleDelete("Premium")
                              }
                            />
                          ) : (
                            <div style={{ marginLeft: 130 }}></div>
                          )}
                          <div>PREMIUM</div>
                          <h1 style={{ fontSize: "3.5rem" }}>{qtdPremium}</h1>
                        </div>
                      </div>
                      <div
                        style={{
                          margin: "1rem",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <h2
                          style={{
                            //   color: "white",
                            fontSize: "0.8rem",
                            display: "flex",
                            textAlign: "center",
                            justifyContent: "center",
                            // alignItems: "flex-start",
                          }}
                        >
                          R$
                          <span
                            style={{ fontSize: "2rem", marginTop: "-0.5rem" }}
                          >
                            {((qtdPremium + qtdStandard) * 49.9).toFixed(2)}
                          </span>
                        </h2>
                        <Button
                          style={{ width: "100%" }}
                          onClick={() => {
                            if (qtdPremium + qtdStandard > 0) {
                              if (inPremiumBank > 0 && inStandardBank > 0) {
                                if (
                                  qtdPremium < inPremiumBank ||
                                  qtdStandard < inStandardBank
                                ) {
                                  setModalInform(true);
                                } else {
                                  setModalContract(true);
                                }
                              } else {
                                setModalContract(true);
                              }
                            } else {
                              toast.error("Selecione pelo menos um produto");
                            }
                          }}
                        >
                          {edit ? "CONFIRMAR ALTERAÇÃO" : "CONTRATAR"}
                        </Button>
                      </div>
                    </div>
                  </CardData>
                  <br />
                  <div style={{ display: "flex", gap: 10 }}>
                    <CardData2
                      style={{
                        width: "50%",
                        maxHeight: "50vh",
                        overflowY: "scroll",
                      }}
                    >
                      <h4
                        className="title"
                        style={{
                          fontWeight: "bold",
                          marginTop: -10,
                          marginBottom: 20,
                        }}
                      >
                        STANDARD
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          marginTop: "1rem",
                          flexWrap: "wrap",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {standardOpt.map((s, idx) => (
                          <div
                            key={idx}
                            style={{
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <CardLogo
                              style={{
                                minWidth: 71,
                                minHeight: 71,
                                backgroundImage: s.img,
                              }}
                              onClick={() =>
                                handleSelect({
                                  ...s,
                                  type: "Standard",
                                  idx: idx,
                                })
                              }
                            />
                            <h5 style={{ marginTop: "0.8rem" }}>
                              {s.title}
                              <GrCircleInformation
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setInfo({
                                    title: s.title,
                                    text: s.description,
                                  });
                                  setModal(true);
                                }}
                              />
                            </h5>
                          </div>
                        ))}
                      </div>
                    </CardData2>
                    <CardData2
                      style={{
                        width: "50%",
                        maxHeight: "50vh",
                        overflowY: "scroll",
                      }}
                    >
                      <h4
                        className="title"
                        style={{
                          fontWeight: "bold",
                          marginTop: -10,
                          marginBottom: 20,
                        }}
                      >
                        PREMIUM
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          marginTop: "1rem",
                          flexWrap: "wrap",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {premiumOpt.map((p, idx) => (
                          <div
                            key={idx}
                            style={{
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <CardLogo
                              style={{
                                minWidth: 71,
                                minHeight: 71,
                                backgroundImage: p.img,
                              }}
                              onClick={() =>
                                handleSelect({
                                  ...p,
                                  type: "Premium",
                                  idx: idx,
                                })
                              }
                            />
                            <h5 style={{ marginTop: "0.8rem" }}>
                              {p.title}
                              <GrCircleInformation
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setInfo({
                                    title: p.title,
                                    text: p.description,
                                  });
                                  setModal(true);
                                }}
                              />
                            </h5>
                          </div>
                        ))}
                      </div>
                    </CardData2>
                  </div>
                </ContainerMobile>
              </>
            )}
          </>
        )}
      </PageLayout>
      <Dialog open={modal} onClose={() => setModal(false)}>
        <DialogTitle>{info?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{info?.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalInform} onClose={() => setModalInform(false)}>
        <DialogTitle>Importante</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`${
              inPremiumBank - qtdPremium > 0
                ? `Você está removendo ${
                    inPremiumBank - qtdPremium
                  } produto(s) Premium do plano atual. Lembre-se que ele(s) serão visualizados em seu painel até ${getDate(
                    "P"
                  )}.`
                : ""
            }`}
            {`${
              inStandardBank - qtdStandard > 0
                ? ` Você está removendo ${
                    inStandardBank - qtdStandard
                  } produto(s) Standard do plano atual. Lembre-se que ele(s) serão visualizados em seu painel até ${getDate(
                    "Q"
                  )}.`
                : ""
            }`}
            Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalInform(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              setModalInform(false);
              setModalContract(true);
            }}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalContract} maxWidth="md" fullWidth>
        {/* <DialogTitle>Pagamento</DialogTitle> */}
        <DialogContent>
          <DialogContentText>
            <Pgto
              changeModal={changeModal}
              email={email}
              products={{
                standard: qtdStandard,
                premium: qtdPremium,
                hasStandard,
                hasPremium,
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button invert onClick={() => setModalContract(false)}>
            CANCELAR
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
