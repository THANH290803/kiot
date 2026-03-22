import Link from "next/link"
import { ArrowRight, RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const highlights = [
  {
    number: "01",
    title: "Phom dáng tinh gọn",
    description: "Những thiết kế ưu tiên đường cắt sạch, dễ phối và không nhanh lỗi thời.",
  },
  {
    number: "02",
    title: "Chất liệu dễ sống cùng",
    description: "Mềm, thoáng, đủ đứng dáng và phù hợp cho nhịp mặc hàng ngày.",
  },
  {
    number: "03",
    title: "Tinh thần hiện đại",
    description: "Không phô trương, nhưng đủ sắc nét để tạo cảm giác tự tin khi xuất hiện.",
  },
]

const services = [
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    description: "Từ đơn đầu tiên đến đơn lặp lại, tốc độ và theo dõi trạng thái luôn rõ ràng.",
  },
  {
    icon: ShieldCheck,
    title: "Chọn lọc kỹ trước khi lên kệ",
    description: "Ưu tiên form, độ hoàn thiện và cảm giác mặc thật thay vì chỉ đẹp trên ảnh.",
  },
  {
    icon: RotateCcw,
    title: "Đổi trả linh hoạt",
    description: "Dễ đổi size, đổi màu hoặc xử lý đơn theo chính sách minh bạch và gọn gàng.",
  },
]

const editorialCards = [
  {
    title: "Soft Structure",
    subtitle: "Những lớp trang phục nhẹ, đứng phom và phù hợp từ sáng đến tối.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1400&fit=crop",
    size: "large",
  },
  {
    title: "Quiet Tailoring",
    subtitle: "Đơn giản nhưng sắc nét, dành cho cảm giác chỉn chu mà không gò bó.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1200&fit=crop",
    size: "small",
  },
  {
    title: "Weekend Ease",
    subtitle: "Những món đồ dễ mặc, dễ chuyển nhịp và vẫn giữ được chất riêng.",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&h=1200&fit=crop",
    size: "small",
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,#f5ede3_0%,#faf7f1_28%,#ffffff_58%,#f4f7fb_100%)] text-stone-900">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-full border border-stone-200/80 bg-white/75 px-5 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold text-white">
              K
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500">Kiot Studio</p>
              <p className="text-sm font-semibold tracking-[0.18em] text-stone-900">MODERN ESSENTIALS</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-stone-600 md:flex">
            <Link href="/user/home" className="transition-colors hover:text-stone-950">
              Bộ sưu tập
            </Link>
            <Link href="/user/shop" className="transition-colors hover:text-stone-950">
              Mới về
            </Link>
            <Link href="/user/login" className="transition-colors hover:text-stone-950">
              Tài khoản
            </Link>
          </nav>
        </header>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-10">
        <div className="flex flex-col justify-center">
          <div className="space-y-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Tủ đồ được chọn lọc cho nhịp sống hiện đại
            </p>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
                Mặc đẹp theo cách
                <span className="block text-stone-500">ít phô trương hơn,</span>
                nhưng sắc nét hơn.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-stone-600">
                Một landing page mang tinh thần biên tập: hình ảnh lớn, khoảng thở rộng, lời giới thiệu vừa đủ và cảm giác thương hiệu rõ ràng ngay từ màn hình đầu tiên.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="rounded-full bg-stone-950 px-7 text-white hover:bg-stone-800">
                <Link href="/user/home">
                  Khám phá bộ sưu tập
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-stone-300 bg-white px-7 text-stone-900 hover:bg-stone-50">
                <Link href="/user/login">Đăng nhập</Link>
              </Button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.number} className="border-white/80 bg-white/78 shadow-sm backdrop-blur">
                <CardContent className="space-y-3 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-stone-400">{item.number}</p>
                  <h2 className="text-lg font-semibold text-stone-950">{item.title}</h2>
                  <p className="text-sm leading-6 text-stone-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {editorialCards.map((card) => (
            <Link
              key={card.title}
              href="/user/shop"
              className={card.size === "large" ? "group relative overflow-hidden rounded-[2rem] sm:col-span-2" : "group relative overflow-hidden rounded-[1.75rem]"}
            >
              <img
                src={card.image}
                alt={card.title}
                className={card.size === "large"
                  ? "h-[430px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] sm:h-[500px]"
                  : "h-[280px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] sm:h-[320px]"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className={card.size === "large" ? "absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9" : "absolute bottom-0 left-0 right-0 p-5 text-white"}>
                <p className="text-xs uppercase tracking-[0.28em] text-white/65">Editorial Selection</p>
                <h2 className={card.size === "large" ? "mt-3 text-4xl font-semibold tracking-tight" : "mt-3 text-2xl font-semibold tracking-tight"}>
                  {card.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">{card.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-stone-200/80 bg-white/72 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Dịch vụ</p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
                Đẹp ở cảm giác sử dụng, không chỉ ở khung hình.
              </h2>
              <p className="text-base leading-7 text-stone-600">
                Một thương hiệu thời trang không dừng ở hình ảnh. Trải nghiệm sau khi chọn sản phẩm, đặt hàng và nhận hàng cũng phải đủ gọn, rõ và đáng tin.
              </p>
            </div>

            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.title} className="border-stone-200/70 bg-stone-50/70 shadow-none">
                  <CardContent className="flex gap-4 p-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-stone-950 shadow-sm">
                      <service.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-950">{service.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{service.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-200/80 bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Tông cảm xúc</p>
            <p className="mt-3 text-lg font-medium text-stone-900">Sáng, sạch, có khoảng thở và không ép người dùng phải quyết định quá sớm.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Ngôn ngữ hình ảnh</p>
            <p className="mt-3 text-lg font-medium text-stone-900">Hero lớn, ảnh biên tập, lớp chữ ngắn và CTA rõ nhưng không ồn.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Điểm vào chính</p>
            <p className="mt-3 text-lg font-medium text-stone-900">Người dùng được dẫn tự nhiên sang mua sắm hoặc đăng nhập khi đã sẵn sàng.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">URL local</p>
            <p className="mt-3 text-lg font-medium text-stone-900">`/` là landing page, `/user/home` là điểm bắt đầu chính của trải nghiệm.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
