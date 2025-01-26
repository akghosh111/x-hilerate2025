import { SOCIAL_MEDIA_LINKS } from "../constants"
import {CONTACT} from "../constants"

const Contact = () => {
  return (
    <>
        <div className="mx-auto max-w-full">
            <p className="my-10 text-center font-semibold text-2xl lg:text-3xl">Any queries?

            </p>
            <p className="p-4 text-center text-xl">{CONTACT.text}</p>
            <p className="my-4 text-center text-xl font-medium text-purple-700 lg:pt-6 lg:text-2xl">{CONTACT.email}
            </p>
            <p className="my-4 text-center text-xl font-medium text-purple-700 lg:pb-6 lg:text-2xl">{CONTACT.phone}
            </p>
        </div>
        <div className="mt-20 flex items-center justify-center gap-8">
            {SOCIAL_MEDIA_LINKS.map((link, index) => (
                <a key={{index}} href={link.href} target="_blank" rel="noopener noreferrer">{link.icon}</a>
            ))}
        </div>

        <p className="my-8 text-center text-gray-400">&copy; Anukiran Ghosh. All rights reserved.</p>
    </>
  )
}

export default Contact;